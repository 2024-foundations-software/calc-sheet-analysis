/**
 * @jest-environment jsdom
 */

import React from 'react';
import './App.css';
import SpreadSheetEngine from './Engine/SpreadSheetEngine';
import SpreadSheet from './Components/SpreadSheet';

function App() {
  const machine = new SpreadSheetEngine(5, 8);
  return (
    <div className="App">
      <header className="App-header">

        <SpreadSheet machine={machine} />

      </header>

    </div>
  );
}

export default App;


