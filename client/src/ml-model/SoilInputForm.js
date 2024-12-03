import React, { useState } from 'react';
import './SoilInputForm.css';

export default function SoilInputForm() {
  const [chat, setChat] = useState([]);
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      alert('Please upload a PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch prediction');
      }

      const data = await response.json();
      const soilData = data.soilData;
      setChat((prevChat) => [
        ...prevChat,
        { type: 'user', message: soilData, file: URL.createObjectURL(file) },
        { type: 'bot', message: `Best predicted crop is ${data.predicted_crop}` },
      ]);
      setFile(null);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while predicting the crop. Please try again.');
    }
  };

  return (
    <div className="soil-input-form">
      <div className="chat-window">
        {chat.length === 0 && <div className="no-chat-message">Upload soil report to get prediction.</div>}
        {chat.map((entry, index) => (
          <div className={`chat-entry ${entry.type}`} key={index}>
            {entry.type === 'bot' && <div className="bot-message">{entry.message}</div>}
            {entry.file && (
              <iframe src={entry.file} title={`PDF Preview ${index}`} className="pdf-preview" />
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="input-form">
        <div className="file-input-container">
          <label htmlFor="file-upload" className="file-upload-label">
            📎 Choose a file
          </label>
          <input id="file-upload" type="file" accept="application/pdf" onChange={handleFileChange} />
          <span className="file-name">{file ? file.name : 'No file chosen'}</span>
          <button type="submit">Predict Crop</button>
        </div>
      </form>
    </div>
  );
}
