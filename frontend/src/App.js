import React, { useState } from 'react';
import './App.css';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const analyzeImage = async () => {
    if (!selectedImage) return;
    if (selectedImage.size > MAX_FILE_SIZE) {
      setAnswer("❌ Error: Image is too large. Max size is 5MB.");
      return;
    }
    setIsLoading(true);

    const reader = new FileReader();
    reader.readAsDataURL(selectedImage);
    reader.onloadend = async () => {
      const base64Image = reader.result.split(',')[1];
      const imageType = selectedImage.type;

      try {
        const response = await fetch('https://neurashala-backend.onrender.com/analyze-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: "google/gemini-pro-vision",
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: "What is in this image?" },
                  { 
                    type: "image_url",
                    image_url: { 
                      url: `data:${imageType};base64,${base64Image}`
                    }
                  }
                ]
              }
            ]
          })
        });
        const data = await response.json();
        setAnswer(data.choices[0].message.content);
      } catch (error) {
        setAnswer("❌ Error: Couldn't analyze the image.");
      }
      setIsLoading(false);
    };
  };

  const clear = () => {
    setSelectedImage(null);
    setAnswer('');
  };

  return (
    <div className="App">
      <h1>Neurashala AI</h1>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setSelectedImage(e.target.files[0])}
      />
      <button onClick={analyzeImage} disabled={!selectedImage || isLoading}>
        {isLoading ? 'Analyzing...' : 'Analyze Image'}
      </button>
      <button onClick={clear} disabled={!selectedImage}>
        Clear
      </button>
      {isLoading && <div className="loader"></div>}
      {selectedImage && (
        <div className="image-preview">
          <img 
            src={URL.createObjectURL(selectedImage)} 
            alt="Preview" 
            style={{ maxWidth: '300px', margin: '20px 0' }}
          />
        </div>
      )}
      {answer && (
        <div className="answer-box">
          <h3>AI Analysis:</h3>
          <p style={{ color: answer.startsWith("❌") ? "red" : "black" }}>{answer}</p>
        </div>
      )}
      <footer>
        <p>Powered by <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer">OpenRouter.ai</a></p>
        <p>&copy; 2024 Neurashala. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;