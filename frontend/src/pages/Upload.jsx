import { useState } from "react";
import api from "../services/api";

function Upload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      
      const res = await api.post("/upload", formData);

      setMessage(
        `Successfully uploaded ${res.data.totalRecords} records`
      );
    }
    catch (err) {
  console.error(err);

  if (err.response) {
    console.log("Status:", err.response.status);
    console.log("Response:", err.response.data);

    setMessage(
      err.response.data.message || `Error: ${err.response.status}`
    );
  } else {
    setMessage(err.message);
  }
}
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Upload CSV</h2>

      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br />
      <br />

      <button onClick={handleUpload}>
        Upload
      </button>

      <h3>{message}</h3>
    </div>
  );
}

export default Upload;