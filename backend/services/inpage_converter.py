import os
import time
import subprocess
import glob
import shutil
from pywinauto import Application, timings
from pywinauto.keyboard import send_keys

# Common InPage installation paths — checks all automatically
INPAGE_PATHS = [
    r"C:\Program Files\InPage Professional\InPage.exe",
    r"C:\Program Files (x86)\InPage Professional\InPage.exe",
    r"C:\Program Files\InPage Urdu Professional\InPage.exe",
    r"C:\Program Files (x86)\InPage Urdu Professional\InPage.exe",
    r"C:\Program Files\InPage\InPage.exe",
    r"C:\Program Files (x86)\InPage\InPage.exe",
    r"C:\InPage\InPage.exe",
]


def find_inpage():
    """Find InPage executable on this machine."""
    # 1) Look for InPage.exe available in PATH
    in_path = shutil.which("InPage.exe")
    if in_path and os.path.exists(in_path):
        return in_path

    # 2) Check common known install paths
    for path in INPAGE_PATHS:
        if os.path.exists(path):
            return path

    # 3) Best-effort search inside Program Files locations
    search_roots = [
        r"C:\Program Files",
        r"C:\Program Files (x86)",
    ]
    patterns = [
        os.path.join(root, "**", "InPage.exe")
        for root in search_roots
        if os.path.isdir(root)
    ]
    for pattern in patterns:
        matches = glob.glob(pattern, recursive=True)
        if matches:
            return matches[0]

    return None


def is_inpage_installed():
    return find_inpage() is not None


def convert_inp_to_pdf(inp_path, output_path):
    """
    Opens the .inp file in InPage, exports it as PDF,
    saves to output_path, then closes InPage.
    """
    inpage_exe = find_inpage()
    if not inpage_exe:
        raise RuntimeError(
            "InPage is not installed (or not detected). Please install InPage Professional and try again."
        )

    inp_path    = os.path.abspath(inp_path)
    output_path = os.path.abspath(output_path)
    output_dir  = os.path.dirname(output_path)

    # --- 1. Launch InPage with the file ---
    proc = subprocess.Popen([inpage_exe, inp_path])
    time.sleep(6)  # Give InPage time to fully load (increase if slow PC)

    try:
        # --- 2. Connect to the InPage window ---
        app = Application(backend="win32").connect(
            title_re=".*InPage.*", timeout=15
        )
        win = app.top_window()
        win.set_focus()
        time.sleep(1)

        # --- 3. Open File menu → Export as PDF ---
        # Try menu first (InPage 3.x)
        try:
            win.menu_select("File->Export As PDF")
            time.sleep(2)
        except Exception:
            # Fallback: use Alt+F to open File menu, then keyboard nav
            send_keys("%f")          # Alt + F  →  File menu
            time.sleep(0.8)
            send_keys("e")           # 'e' for Export
            time.sleep(0.8)
            send_keys("{ENTER}")
            time.sleep(2)

        # --- 4. Handle the Save/Export dialog ---
        # The dialog asks where to save the PDF
        try:
            dlg = app.window(title_re=".*Save.*|.*Export.*|.*PDF.*")
            dlg.wait("visible", timeout=8)

            # Clear the filename field and type our output path
            filename_field = dlg.child_window(class_name="Edit")
            filename_field.set_focus()
            filename_field.set_text(output_path)
            time.sleep(0.5)

            # Click Save / OK
            try:
                dlg.child_window(title_re="Save|OK|Export").click()
            except Exception:
                send_keys("{ENTER}")

            time.sleep(3)  # Wait for PDF to be written

        except Exception as dlg_error:
            raise RuntimeError(
                f"Could not interact with the Save dialog: {dlg_error}"
            )

        # --- 5. Verify output was created ---
        if not os.path.exists(output_path):
            # InPage sometimes saves with its own name in the same folder
            # Try to find any new PDF in output_dir
            pdfs = glob.glob(os.path.join(output_dir, "*.pdf"))
            if pdfs:
                newest = max(pdfs, key=os.path.getctime)
                os.rename(newest, output_path)
            else:
                raise RuntimeError("PDF was not created. Check InPage version compatibility.")

    finally:
        # --- 6. Close InPage ---
        try:
            win = app.top_window()
            win.close()
            time.sleep(1)

            # Dismiss "Save changes?" dialog if it appears
            try:
                confirm = app.top_window()
                confirm.child_window(title_re="No|Don't Save").click()
            except Exception:
                pass
        except Exception:
            # Force kill if graceful close fails
            proc.terminate()