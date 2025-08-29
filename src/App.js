import React, { useState } from 'react';
import './App.css';

// This component renders the spinning cube and instructions
const HomePage = ({ onStartClick }) => {
  return (
    <div className="homepage-container">
      <h1>Rubik's Cube Solver</h1>

      {/* This is the 3D spinning cube */}
      <div className="scene">
        <div className="cube">
          <div className="face front">
            <div className="sticker green"></div><div className="sticker green"></div><div className="sticker green"></div>
            <div className="sticker green"></div><div className="sticker green"></div><div className="sticker green"></div>
            <div className="sticker green"></div><div className="sticker green"></div><div className="sticker green"></div>
          </div>
          <div className="face back">
            <div className="sticker blue"></div><div className="sticker blue"></div><div className="sticker blue"></div>
            <div className="sticker blue"></div><div className="sticker blue"></div><div className="sticker blue"></div>
            <div className="sticker blue"></div><div className="sticker blue"></div><div className="sticker blue"></div>
          </div>
          <div className="face right">
            <div className="sticker red"></div><div className="sticker red"></div><div className="sticker red"></div>
            <div className="sticker red"></div><div className="sticker red"></div><div className="sticker red"></div>
            <div className="sticker red"></div><div className="sticker red"></div><div className="sticker red"></div>
          </div>
          <div className="face left">
            <div className="sticker orange"></div><div className="sticker orange"></div><div className="sticker orange"></div>
            <div className="sticker orange"></div><div className="sticker orange"></div><div className="sticker orange"></div>
            <div className="sticker orange"></div><div className="sticker orange"></div><div className="sticker orange"></div>
          </div>
          <div className="face top">
            <div className="sticker white"></div><div className="sticker white"></div><div className="sticker white"></div>
            <div className="sticker white"></div><div className="sticker white"></div><div className="sticker white"></div>
            <div className="sticker white"></div><div className="sticker white"></div><div className="sticker white"></div>
          </div>
          <div className="face bottom">
            <div className="sticker yellow"></div><div className="sticker yellow"></div><div className="sticker yellow"></div>
            <div className="sticker yellow"></div><div className="sticker yellow"></div><div className="sticker yellow"></div>
            <div className="sticker yellow"></div><div className="sticker yellow"></div><div className="sticker yellow"></div>
          </div>
        </div>
      </div>

      <div className="instructions">
        <h3>Orient your cube as shown here to input:</h3>
        <ul>
          <li><strong>Green</strong> center at <strong>Front</strong></li>
          <li><strong>White</strong> center at <strong>Top</strong></li>
          <li><strong>Red</strong> center at <strong>Right</strong></li>
          <li><strong>Blue</strong> center at <strong>Back</strong></li>
          <li><strong>Yellow</strong> center at <strong>Bottom</strong></li>
          <li><strong>Orange</strong> center at <strong>Left</strong></li>
        </ul>
      </div>

      <button className="start-button" onClick={onStartClick}>
        Start
      </button>
    </div>
  );
};

// This component will be for the color input UI
const ColorInputPage = () => {
  return (
    <div className="input-page-container">
      <h1>Input Your Cube's Colors</h1>
      <p>This is where the unfolded T-shaped cube will go.</p>
      {/* We will build the color input grid here next */}
    </div>
  );
};


// Main App component to manage which page is shown
function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const handleStart = () => {
    setCurrentPage('colorInput');
  };

  return (
    <div className="App">
      {currentPage === 'home' ? (
        <HomePage onStartClick={handleStart} />
      ) : (
        <ColorInputPage />
      )}
    </div>
  );
}

export default App;