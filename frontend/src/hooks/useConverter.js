import { useState } from "react";
import axios from "axios";
import { buildRequest } from "../conversionConfig";

const API_BASE = "http://localhost:5000";

export function useConverter() {
  const [status, setStatus]       = useState("idle"); // idle | converting | done | error
  const [progress, setProgress]   = useState(0);
  const [result, setResult]       = useState(null);
  const [errorMsg, setErrorMsg]   = useState("");

  async function convert(file, inputExt, outputFormat) {
    setStatus("converting");
    setProgress(0);
    setResult(null);
    setErrorMsg("");

    const { endpoint, formData } = buildRequest(file, inputExt, outputFormat);

    try {
      const response = await axios.post(`${API_BASE}${endpoint}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (e.total) setProgress(Math.round((e.loaded / e.total) * 60));
        },
      });

      setProgress(100);
      setResult(response.data);
      setStatus("done");
    } catch (err) {
      const msg = err.response?.data?.error || err.message || "Unknown error";
      setErrorMsg(msg);
      setStatus("error");
    }
  }

  function reset() {
    setStatus("idle");
    setProgress(0);
    setResult(null);
    setErrorMsg("");
  }

  return { status, progress, result, errorMsg, convert, reset };
}
