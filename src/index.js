import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js'; // Make sure it points to your App file

// This finds the 'root' div in your public/index.html file
const root = ReactDOM.createRoot(document.getElementById('root'));

// This tells React to render your main App component
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
