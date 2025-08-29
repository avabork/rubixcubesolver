import React, { useState } from 'react';

// Main App component to manage which page is shown
function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className="App">
      {/* Renders CSS styles directly into the document head */}
      <style>{`
        body {
          background-color: #282c34;
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
          margin: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          text-align: center;
        }
        .App { width: 100%; padding: 20px; box-sizing: border-box; }
        .homepage-container, .input-page-container { display: flex; flex-direction: column; align-items: center; gap: 20px; }
        .scene { width: 200px; height: 200px; perspective: 600px; margin-top: 20px; }
        .cube { width: 100%; height: 100%; position: relative; transform-style: preserve-3d; animation: spin 12s infinite linear; }
        @keyframes spin {
          from { transform: rotateX(-20deg) rotateY(0deg); }
          to { transform: rotateX(-20deg) rotateY(360deg); }
        }
        .face { position: absolute; width: 200px; height: 200px; border: 2px solid #1a1a1a; box-sizing: border-box; display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; padding: 6px; background-color: #1a1a1a; }
        .front { transform: rotateY(0deg) translateZ(100px); }
        .back { transform: rotateY(180deg) translateZ(100px); }
        .right { transform: rotateY(90deg) translateZ(100px); }
        .left { transform: rotateY(-90deg) translateZ(100px); }
        .top { transform: rotateX(90deg) translateZ(100px); }
        .bottom { transform: rotateX(-90deg) translateZ(100px); }
        .sticker { width: 100%; height: 100%; border-radius: 4px; }
        .green { background-color: #009E60; } .blue { background-color: #0051BA; } .red { background-color: #C41E3A; } .orange { background-color: #FF5800; } .white { background-color: #FFFFFF; } .yellow { background-color: #FFD500; }
        .instructions { background-color: #3c4049; padding: 10px 25px; border-radius: 8px; max-width: 350px; }
        .instructions ul { list-style: none; padding: 0; text-align: left; }
        .instructions li { margin: 8px 0; }
        .start-button { background-color: #4CAF50; color: white; border: none; padding: 15px 32px; text-align: center; font-size: 18px; font-weight: bold; border-radius: 8px; cursor: pointer; transition: background-color 0.3s; }
        .start-button:hover { background-color: #45a049; }
        .color-palette { display: flex; gap: 10px; margin-bottom: 20px; }
        .palette-color { width: 50px; height: 50px; border: 3px solid #444; border-radius: 8px; cursor: pointer; transition: all 0.2s ease; }
        .palette-color.active { border-color: #fff; transform: scale(1.1); box-shadow: 0 0 15px rgba(255, 255, 255, 0.5); }
        .cube-net { display: grid; grid-template-areas: ". up ." "left front right back" ". down ."; gap: 6px; }
        .input-face { width: 150px; height: 150px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; background-color: #1a1a1a; padding: 4px; border-radius: 5px; }
        .up { grid-area: up; } .left { grid-area: left; } .front { grid-area: front; } .right { grid-area: right; } .back { grid-area: back; } .down { grid-area: down; }
        .middle-row { display: contents; }
        .input-sticker { background-color: #777; border-radius: 4px; cursor: pointer; }
        .input-sticker.center { cursor: not-allowed; }
        .button-group { margin-top: 20px; display: flex; gap: 20px; }
        .control-button { background-color: #6c757d; color: white; padding: 12px 28px; font-size: 16px; font-weight: bold; border: none; border-radius: 8px; cursor: pointer; transition: background-color 0.3s; }
        .control-button:hover { background-color: #5a6268; }
        .solve-button { background-color: #007bff; color: white; padding: 12px 28px; font-size: 16px; font-weight: bold; border: none; border-radius: 8px; cursor: pointer; transition: background-color 0.3s; }
        .solve-button:hover { background-color: #0069d9; }
      `}</style>
      
      {currentPage === 'home' ? (
        <HomePage onStartClick={() => setCurrentPage('colorInput')} />
      ) : (
        <ColorInputPage onBackClick={() => setCurrentPage('home')} />
      )}
    </div>
  );
}

// Homepage Component
const HomePage = ({ onStartClick }) => {
  return (
    <div className="homepage-container">
      <h1>Rubik's Cube Solver</h1>
      <div className="scene">
        <div className="cube">
          <div className="face front"><div className="sticker green"></div><div className="sticker green"></div><div className="sticker green"></div><div className="sticker green"></div><div className="sticker green"></div><div className="sticker green"></div><div className="sticker green"></div><div className="sticker green"></div><div className="sticker green"></div></div>
          <div className="face back"><div className="sticker blue"></div><div className="sticker blue"></div><div className="sticker blue"></div><div className="sticker blue"></div><div className="sticker blue"></div><div className="sticker blue"></div><div className="sticker blue"></div><div className="sticker blue"></div><div className="sticker blue"></div></div>
          <div className="face right"><div className="sticker red"></div><div className="sticker red"></div><div className="sticker red"></div><div className="sticker red"></div><div className="sticker red"></div><div className="sticker red"></div><div className="sticker red"></div><div className="sticker red"></div><div className="sticker red"></div></div>
          <div className="face left"><div className="sticker orange"></div><div className="sticker orange"></div><div className="sticker orange"></div><div className="sticker orange"></div><div className="sticker orange"></div><div className="sticker orange"></div><div className="sticker orange"></div><div className="sticker orange"></div><div className="sticker orange"></div></div>
          <div className="face top"><div className="sticker white"></div><div className="sticker white"></div><div className="sticker white"></div><div className="sticker white"></div><div className="sticker white"></div><div className="sticker white"></div><div className="sticker white"></div><div className="sticker white"></div><div className="sticker white"></div></div>
          <div className="face bottom"><div className="sticker yellow"></div><div className="sticker yellow"></div><div className="sticker yellow"></div><div className="sticker yellow"></div><div className="sticker yellow"></div><div className="sticker yellow"></div><div className="sticker yellow"></div><div className="sticker yellow"></div><div className="sticker yellow"></div></div>
        </div>
      </div>
      <div className="instructions">
        <h3>Orient your cube as shown here to input:</h3>
        <ul>
          <li><strong>Green</strong> center at <strong>Front</strong></li>
          <li><strong>White</strong> center at <strong>Top</strong></li>
          <li><strong>Red</strong> center at <strong>Right</strong></li>
        </ul>
      </div>
      <button className="start-button" onClick={onStartClick}>Start</button>
    </div>
  );
};

// Color Input Page Component
const ColorInputPage = ({ onBackClick }) => {
  const COLORS = { W: '#FFFFFF', Y: '#FFD500', G: '#009E60', B: '#0051BA', R: '#C41E3A', O: '#FF5800' };
  const [activeColor, setActiveColor] = useState('G');

  const [cubeState, setCubeState] = useState({
    up: Array(9).fill(null).map((_, i) => i === 4 ? 'W' : null),
    left: Array(9).fill(null).map((_, i) => i === 4 ? 'O' : null),
    front: Array(9).fill(null).map((_, i) => i === 4 ? 'G' : null),
    right: Array(9).fill(null).map((_, i) => i === 4 ? 'R' : null),
    back: Array(9).fill(null).map((_, i) => i === 4 ? 'B' : null),
    down: Array(9).fill(null).map((_, i) => i === 4 ? 'Y' : null),
  });

  const handleStickerClick = (face, index) => {
    if (index === 4) return;
    setCubeState(prev => ({
      ...prev,
      [face]: prev[face].map((c, i) => i === index ? activeColor : c)
    }));
  };

  const Face = ({ faceName, stickers }) => (
    <div className={`input-face ${faceName}`}>
      {stickers.map((color, index) => (
        <div
          key={index}
          className={`input-sticker ${index === 4 ? 'center' : ''}`}
          style={{ backgroundColor: color ? COLORS[color] : '#777' }}
          onClick={() => handleStickerClick(faceName, index)}
        />
      ))}
    </div>
  );

  return (
    <div className="input-page-container">
      <h1>Input Your Cube's Colors</h1>
      <p>Select a color and paint the facelets to match your cube.</p>

      <div className="color-palette">
        {Object.entries(COLORS).map(([code, colorName]) => (
          <button
            key={code}
            className={`palette-color ${activeColor === code ? 'active' : ''}`}
            style={{ backgroundColor: colorName }}
            onClick={() => setActiveColor(code)}
          />
        ))}
      </div>
      
      <div className="cube-net">
        <Face faceName="up" stickers={cubeState.up} />
        <div className="middle-row">
          <Face faceName="left" stickers={cubeState.left} />
          <Face faceName="front" stickers={cubeState.front} />
          <Face faceName="right" stickers={cubeState.right} />
          <Face faceName="back" stickers={cubeState.back} />
        </div>
        <Face faceName="down" stickers={cubeState.down} />
      </div>

      <div className='button-group'>
        <button className="control-button" onClick={onBackClick}>Back</button>
        <button className="solve-button">Solve!</button>
      </div>
    </div>
  );
};

export default App;