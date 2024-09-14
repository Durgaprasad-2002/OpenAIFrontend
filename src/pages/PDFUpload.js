import React, { useState } from 'react';
import axios from 'axios';
import "./style.css"

const PDFUpload = () => {
  const [apiKey, setApiKey] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [htmlContent, setHtmlContent] = useState(''); // State to store the generated HTML content

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    alert("File Uploaded")
  };

  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if API key and file are provided
    if (!apiKey) {
      alert('Please enter the API key.');
      return;
    }
    
    if (!selectedFile) {
      alert('Please select a PDF file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', selectedFile);

    try {
      const response = await axios.post(`https://openaibackend-cdse.onrender.com/upload?api=${apiKey}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadStatus('Resume generated successfully!');
      setHtmlContent(response.data.html); // Store the received HTML content
      console.log('HTML Resume:', response.data.html);
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('Failed to generate resume.');
    }
  };

  // Function to download the HTML content as a .html file
  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([htmlContent], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = 'resume.html';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return (
    <div className='main-container'>
      <div className='Container'>
      <form onSubmit={handleSubmit} className='form-conatiner'>
        <h3 className='h3'>HTML Resume Builder</h3>
        <input 
          className='input-field'
          type="text" 
          placeholder="Enter API key"
          onChange={handleApiKeyChange} 
          value={apiKey}
        />
 
        <label className={` ${!selectedFile?'not-uploaded':'uploaded'} file-upload-container`} >
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={handleFileChange} 
          />
          <span class="file-upload-text">Choose PDF File</span>
        </label>

        <button className={` ${!apiKey || !selectedFile?'submit-btn':'blue-bg'}`}  type="submit" disabled={!apiKey || !selectedFile}>
          Generate Resume
        </button>
      
        <p>{uploadStatus}</p>

        {htmlContent && (
          <button onClick={handleDownload} className='blue-bg'>Download Resume as HTML</button>
        )}
        
      </form>
      
      </div>

    </div>
  );
};

export default PDFUpload;
