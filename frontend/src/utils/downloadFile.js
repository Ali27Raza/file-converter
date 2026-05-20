import axios from "axios";

const DEFAULT_BASE_URL = "http://localhost:5000";

function normalizeDownloadUrl(url) {
  if (!url) throw new Error("Missing download URL");

  if (/^https?:\/\//i.test(url)) return url;

  return `${DEFAULT_BASE_URL}${url.startsWith("/") ? url : `/${url}`}`;
}

export async function downloadFile(url, filename) {
  const response = await axios.get(normalizeDownloadUrl(url), { responseType: "blob" });
  const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");

  link.href = blobUrl;
  link.download = filename || "download";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();

  // Give the browser time to start the download before cleaning up the object URL.
  window.setTimeout(() => {
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  }, 1500);
}