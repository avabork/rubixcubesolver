import React, { useState, useEffect, useRef, useCallback } from 'react';
import Cube from 'cubejs';

// --- EMBEDDED CSS (unchanged visual style) ---
const STYLES = `
  body, #root, .app-container {
    background-color: #2F2F31; color: #FDFDFD; font-family: 'Inter', sans-serif;
    height: 100vh; width: 100vw; margin: 0; overflow: hidden;
  }
  .page-container { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 15px; padding: 20px; box-sizing: border-box; height: 100%; }
  h1 { font-size: 2.2rem; margin-bottom: 0; }
  p { font-size: 1.1rem; margin-top: 0; color: #b0b0b0; }
  .scene { width: 200px; height: 200px; perspective: 800px; margin: 10px 0; }
  .cube { width: 100%; height: 100%; position: relative; transform-style: preserve-3d; transform: rotateX(-30deg) rotateY(45deg); }
  .spinning { animation: spin 12s infinite linear; }
  @keyframes spin { from { transform: rotateX(-30deg) rotateY(45deg); } to { transform: rotateX(-30deg) rotateY(405deg); } }
  .face { position: absolute; width: 200px; height: 200px; background-color: #1a1a1a; border: 3px solid #2F2F31; box-sizing: border-box; display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; padding: 6px; }
  .face-front  { transform: rotateY(0deg) translateZ(100px); }
  .face-back   { transform: rotateY(180deg) translateZ(100px); }
  .face-right  { transform: rotateY(90deg) translateZ(100px); }
  .face-left   { transform: rotateY(-90deg) translateZ(100px); }
  .face-up     { transform: rotateX(90deg) translateZ(100px); }
  .face-down   { transform: rotateX(-90deg) translateZ(100px); }
  .sticker { width: 100%; height: 100%; border-radius: 8px; }
  .green { background-color: #009E60; } .blue { background-color: #0051BA; }
  .red { background-color: #C41E3A; } .orange { background-color: #FF5800; }
  .white { background-color: #FFFFFF; } .yellow { background-color: #FFD500; }
  .color-palette { display: flex; gap: 10px; margin-bottom: 10px; }
  .palette-color { width: 45px; height: 45px; border: 3px solid #444; border-radius: 8px; cursor: pointer; transition: all 0.2s ease; }
  .palette-color.active { border-color: #4CA9B6; transform: scale(1.1); box-shadow: 0 0 15px #A5EBE9; }
  .cube-net { display: grid; grid-template-columns: repeat(4, 140px); grid-template-rows: repeat(3, 140px); gap: 5px; justify-content: center; }
  .input-face { width: 140px; height: 140px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; background-color: #1a1a1a; padding: 4px; border-radius: 5px; }
  .up    { grid-area: 1 / 2; } .left  { grid-area: 2 / 1; } .front { grid-area: 2 / 2; }
  .right { grid-area: 2 / 3; } .back  { grid-area: 2 / 4; } .down  { grid-area: 3 / 2; }
  .input-sticker { background-color: #777; border-radius: 4px; cursor: pointer; }
  .input-sticker.center { cursor: not-allowed; }
  .solution-controls { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 15px; }
  .move-display { background-color: #1e1e1e; padding: 10px 20px; border-radius: 8px; font-family: 'Courier New', monospace; font-size: 1.5rem; min-width: 150px; border: 1px solid #444; }
  .move-display span { font-weight: bold; color: #A5EBE9; }
  .button-group { margin-top: 15px; display: flex; gap: 20px; }
  .start-button, .solve-button, .control-button { color: white; border: none; padding: 12px 28px; font-size: 16px; font-weight: bold; border-radius: 8px; cursor: pointer; transition: background-color 0.3s, transform 0.1s; }
  .start-button:hover, .solve-button:hover, .control-button:hover { transform: translateY(-2px); }
  .start-button:disabled, .solve-button:disabled, .control-button:disabled { background-color: #555 !important; cursor: not-allowed; transform: translateY(0); }
  .start-button { background-color: #46C483; }
  .control-button { background-color: #6c757d; }
  .solve-button { background-color: #007bff; }
  .error-message { color: #F8D7DA; font-weight: bold; margin-top: 10px; min-height: 20px; }
`;

// --- Canonical color/face mapping (stick to cubejs expectations) ---
const FACE_TO_COLOR = { U: 'W', R: 'R', F: 'G', D: 'Y', L: 'O', B: 'B' };
const COLOR_TO_FACE = { W: 'U', R: 'R', G: 'F', Y: 'D', O: 'L', B: 'B' };
// cubejs face order (and within each face, row-major 0..8)
const CUBEJS_FACE_ORDER = ['U', 'R', 'F', 'D', 'L', 'B'];
// our UI face keys in the net
const UI_FACE_ORDER_FOR_RENDER = ['up', 'right', 'front', 'down', 'left', 'back'];
const CUBEJS_TO_UI_FACE = { U: 'up', R: 'right', F: 'front', D: 'down', L: 'left', B: 'back' };

// solved UI state
const SOLVED_CUBE_STATE = {
  up:    Array(9).fill('W'),
  right: Array(9).fill('R'),
  front: Array(9).fill('G'),
  down:  Array(9).fill('Y'),
  left:  Array(9).fill('O'),
  back:  Array(9).fill('B'),
};

// --- Helpers: convert between UI state and cubejs string ---

// UI -> cubejs 54-char string (URFDLB, each face row-major)
function uiStateToCubeString(uiState) {
  return CUBEJS_FACE_ORDER
    .map(face => {
      const uiFace = CUBEJS_TO_UI_FACE[face];
      return uiState[uiFace].map(c => COLOR_TO_FACE[c]).join('');
    })
    .join('');
}

// cubejs string -> UI state object
function cubeStringToUiState(str54) {
  if (!str54 || str54.length !== 54) throw new Error('Invalid cube string length');

  const out = { up: [], right: [], front: [], down: [], left: [], back: [] };
  let idx = 0;
  for (const face of CUBEJS_FACE_ORDER) {
    const block = str54.slice(idx, idx + 9).split('');
    const uiFace = CUBEJS_TO_UI_FACE[face];
    out[uiFace] = block.map(letter => FACE_TO_COLOR[letter]); // convert face letters to colors
    idx += 9;
  }
  return out;
}

// --- Minimal renderer (unchanged) ---
const CubeModel = ({ cubeState, spinning = false }) => {
  const COLORS = { W:'white', Y:'yellow', G:'green', B:'blue', R:'red', O:'orange' };
  return (
    <div className="scene">
      <div className={`cube ${spinning ? 'spinning' : ''}`}>
        {Object.keys(cubeState).map(faceName => (
          <div key={faceName} className={`face face-${faceName}`}>
            {cubeState[faceName].map((stickerColor, i) => (
              <div key={i} className={`sticker ${COLORS[stickerColor]}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

function App() {
  const [page, setPage] = useState('home'); // home, input, solution
  const [cubeState, setCubeState] = useState(SOLVED_CUBE_STATE);
  const [activeColor, setActiveColor] = useState('W');
  const [error, setError] = useState('');

  const [solutionMoves, setSolutionMoves] = useState([]);
  const [animState, setAnimState] = useState(null);
  const [animMoveIndex, setAnimMoveIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const animCubeRef = useRef(null);   // cubejs instance used for step-by-step animation
  const initialCubeStringRef = useRef(''); // original string for reset

  const [isSolverReady, setIsSolverReady] = useState(false);

  useEffect(() => {
    // initialize cubejs tables once
    Cube.initSolver();
    setIsSolverReady(true);
  }, []);

  const handleStart = () => {
    setCubeState(JSON.parse(JSON.stringify(SOLVED_CUBE_STATE)));
    setError('');
    setPage('input');
  };

  const handleStickerClick = (face, index) => {
    if (index === 4) return; // keep centers fixed
    setError('');
    setCubeState(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy[face][index] = activeColor;
      return copy;
    });
  };

  const handleSolveClick = () => {
    if (!isSolverReady) {
      setError('Solver is initializing. Try again in a moment.');
      return;
    }
    try {
      // Build cubejs string from UI and solve
      const cubeString = uiStateToCubeString(cubeState);
      initialCubeStringRef.current = cubeString;

      const cube = Cube.fromString(cubeString);
      const sol = cube.solve();         // returns e.g., "U R U' L F2 ..."
      const moves = sol ? sol.trim().split(/\s+/) : [];

      // Prepare animation cube that will be advanced one move at a time
      animCubeRef.current = Cube.fromString(cubeString);
      setAnimState(JSON.parse(JSON.stringify(cubeState)));
      setAnimMoveIndex(-1);
      setSolutionMoves(moves);
      setIsPlaying(false);
      setError('');
      setPage('solution');
    } catch (e) {
      console.error(e);
      setError('Invalid cube configuration. Please check colors and piece counts.');
    }
  };

  // Convert inverse of a single move (for Prev button)
  const invertMove = (m) => {
    if (m.endsWith("2")) return m;           // double move is its own inverse
    if (m.endsWith("'")) return m.slice(0, -1);  // X' -> X
    return m + "'";                           // X -> X'
  };

  const syncAnimStateFromCube = () => {
    // Read the current cubejs facelet string, convert to UI state, and render
    const str = animCubeRef.current.asString();
    const ui = cubeStringToUiState(str);
    setAnimState(ui);
  };

  const handleNext = useCallback(() => {
    if (!animCubeRef.current) return;
    if (animMoveIndex < solutionMoves.length - 1) {
      const nextMove = solutionMoves[animMoveIndex + 1];
      animCubeRef.current.move(nextMove);
      syncAnimStateFromCube();
      setAnimMoveIndex(i => i + 1);
    } else {
      setIsPlaying(false);
    }
  }, [animMoveIndex, solutionMoves]);

  useEffect(() => {
    let t;
    if (isPlaying && animMoveIndex < solutionMoves.length - 1) {
      t = setTimeout(handleNext, 700);
    } else if (isPlaying) {
      setIsPlaying(false);
    }
    return () => clearTimeout(t);
  }, [isPlaying, animMoveIndex, solutionMoves.length, handleNext]);

  const handlePrev = () => {
    if (!animCubeRef.current) return;
    if (animMoveIndex >= 0) {
      const lastMove = solutionMoves[animMoveIndex];
      animCubeRef.current.move(invertMove(lastMove)); // step back
      syncAnimStateFromCube();
      setAnimMoveIndex(i => i - 1);
    }
  };

  const handleResetAnim = () => {
    if (!initialCubeStringRef.current) return;
    animCubeRef.current = Cube.fromString(initialCubeStringRef.current);
    syncAnimStateFromCube();
    setAnimMoveIndex(-1);
    setIsPlaying(false);
  };

  // --- Render pages ---
  const renderPage = () => {
    const COLORS = { W:'#FFFFFF', Y:'#FFD500', G:'#009E60', B:'#0051BA', R:'#C41E3A', O:'#FF5800' };

    switch (page) {
      case 'input':
        return (
          <div className="page-container">
            <h1>Input Your Cube's Colors</h1>
            <p>Select a color and paint the faces to match your cube (centers fixed).</p>

            <div className="color-palette">
              {Object.entries(COLORS).map(([code, color]) => (
                <button key={code}
                        className={`palette-color ${activeColor === code ? 'active' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setActiveColor(code)} />
              ))}
            </div>

            <div className="cube-net">
              {UI_FACE_ORDER_FOR_RENDER.map(faceName => (
                <div key={faceName} className={`input-face ${faceName}`}>
                  {cubeState[faceName].map((color, index) => (
                    <div key={index}
                         className={`input-sticker ${index === 4 ? 'center' : ''}`}
                         style={{ backgroundColor: color ? COLORS[color] : '#777' }}
                         onClick={() => handleStickerClick(faceName, index)} />
                  ))}
                </div>
              ))}
            </div>

            <div className="button-group">
              <button className="control-button" onClick={() => setPage('home')}>Back</button>
              <button className="solve-button" onClick={handleSolveClick}>Solve!</button>
            </div>
            <p className="error-message">{error}</p>
          </div>
        );

      case 'solution':
        return (
          <div className="page-container">
            <h1>Watch the Solution</h1>
            <CubeModel cubeState={animState || SOLVED_CUBE_STATE} />
            {solutionMoves.length > 0 ? (
              <>
                <div className="move-display">
                  Move {animMoveIndex + 1} / {solutionMoves.length}:{" "}
                  <span>{animMoveIndex > -1 ? solutionMoves[animMoveIndex] : 'Start'}</span>
                </div>

                <div className="solution-controls">
                  <button className="control-button" onClick={handleResetAnim}>Reset</button>
                  <button className="control-button" onClick={handlePrev} disabled={animMoveIndex < 0}>Prev</button>
                  <button className="start-button"
                          onClick={() => setIsPlaying(p => !p)}
                          disabled={animMoveIndex >= solutionMoves.length - 1}>
                    {isPlaying ? 'Pause' : 'Play'}
                  </button>
                  <button className="control-button"
                          onClick={handleNext}
                          disabled={animMoveIndex >= solutionMoves.length - 1}>
                    Next
                  </button>
                </div>
              </>
            ) : (
              <p className="error-message">This cube is already solved!</p>
            )}
            <div className="button-group">
              <button className="control-button" onClick={() => setPage('home')}>Start Over</button>
            </div>
          </div>
        );

      default:
        return (
          <div className="page-container">
            <h1>Rubik's Cube Solver</h1>
            <p>Visually solve a 3x3 Rubik's Cube</p>
            <CubeModel cubeState={SOLVED_CUBE_STATE} spinning={true} />
            <div className="button-group">
              <button className="start-button" onClick={handleStart}>Start Solving</button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      <style>{STYLES}</style>
      {renderPage()}
    </div>
  );
}

export default App;