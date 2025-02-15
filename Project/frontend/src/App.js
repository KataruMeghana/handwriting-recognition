import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setText(response.data.recognized_text);
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Failed to recognize text. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Handwriting Recognition</h1>
      <input type="file" onChange={handleFileChange} className="mb-4 p-2 border rounded" />
      <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded">Upload & Recognize</button>
      {text && (
        <div className="mt-4 p-4 bg-white shadow rounded w-1/2">
          <h2 className="text-lg font-semibold">Extracted Text:</h2>
          <p className="mt-2 text-gray-700">{text}</p>
        </div>
      )}
    </div>
  );
};

export default App;
