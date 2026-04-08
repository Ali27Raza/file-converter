const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const PORT = process.env.PORT || 4000;
const CLOUDCONVERT_API_KEY = process.env.CLOUDCONVERT_API_KEY;

const invalidApiKey =
  !CLOUDCONVERT_API_KEY ||
  CLOUDCONVERT_API_KEY === "your_cloudconvert_api_key_here" ||
  CLOUDCONVERT_API_KEY.startsWith("http");

if (invalidApiKey) {
  console.warn(
    "Warning: CLOUDCONVERT_API_KEY is not configured correctly in backend/.env.",
  );
}

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(
    "NextConvertIFile backend is running. POST /convert with a Word file to get PDF converted.",
  );
});

app.post("/convert", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: 'No file uploaded. Use form field name "file".' });
    }

    const { originalname, buffer, mimetype } = req.file;
    const allowed = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];

    if (!allowed.includes(mimetype)) {
      return res
        .status(400)
        .json({ error: "Only Word files (.docx or .doc) are supported." });
    }

    if (invalidApiKey) {
      return res.status(500).json({
        error:
          "CloudConvert API key is missing or invalid. Set CLOUDCONVERT_API_KEY to your secret key in backend/.env.",
      });
    }

    const createJobResponse = await axios.post(
      "https://api.cloudconvert.com/v2/jobs",
      {
        tasks: {
          "import-file": {
            operation: "import/upload",
          },
          "convert-file": {
            operation: "convert",
            input: "import-file",
            output_format: "pdf",
            engine: "office",
          },
          "export-file": {
            operation: "export/url",
            input: "convert-file",
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${CLOUDCONVERT_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const job = createJobResponse.data.data;
    const importTask = job.tasks.find((task) => task.name === "import-file");

    if (!importTask || !importTask.result || !importTask.result.form) {
      throw new Error("Unable to create upload task on CloudConvert.");
    }

    const uploadForm = new FormData();
    const formParams = importTask.result.form.parameters || {};
    Object.entries(formParams).forEach(([key, value]) =>
      uploadForm.append(key, value),
    );
    uploadForm.append("file", buffer, {
      filename: originalname,
      contentType: mimetype,
    });

    await axios.post(importTask.result.form.url, uploadForm, {
      headers: {
        ...uploadForm.getHeaders(),
      },
    });

    let finishedJob = null;
    for (let attempt = 0; attempt < 30; attempt++) {
      const statusResponse = await axios.get(
        `https://api.cloudconvert.com/v2/jobs/${job.id}`,
        {
          headers: {
            Authorization: `Bearer ${CLOUDCONVERT_API_KEY}`,
          },
        },
      );

      const statusData = statusResponse.data.data;
      if (statusData.status === "finished") {
        finishedJob = statusData;
        break;
      }

      if (statusData.status === "error") {
        throw new Error("CloudConvert reported an error during conversion.");
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    if (!finishedJob) {
      throw new Error("Conversion timed out. Try again later.");
    }

    const exportTask = finishedJob.tasks.find(
      (task) => task.name === "export-file",
    );
    const fileData = exportTask?.result?.files?.[0];

    if (!fileData || !fileData.url) {
      throw new Error("Converted file URL not found.");
    }

    res.json({
      downloadUrl: fileData.url,
      filename:
        fileData.filename || `${originalname.replace(/\.[^/.]+$/, "")}.pdf`,
      outputFormat: "pdf",
    });
  } catch (error) {
    console.error(
      "Conversion error:",
      error?.response?.data || error.message || error,
    );
    const message =
      error?.response?.data?.error?.message ||
      error.message ||
      "Conversion failed.";
    res.status(500).json({ error: message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server listening on http://localhost:${PORT}`);
});
