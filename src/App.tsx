/**
 * @jest-environment jsdom
 */

import React from 'react';
import './App.css';
import SpreadSheetEngine from './Engine/SpreadSheetEngine';
import CalculatorInputProcessor from './Components/CalculatorInputProcessor';

function App() {
  const machine = new SpreadSheetEngine(5, 8);
  return (
    <div className="App">
      <header className="App-header">

        <CalculatorInputProcessor machine={machine} />

      </header>

    </div>
  );
}

export default App;


