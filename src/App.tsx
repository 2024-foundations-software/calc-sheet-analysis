/**
 * @jest-environment jsdom
 */

import React from 'react';
import './App.css';
import SpreadSheet from './Components/SpreadSheet';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <SpreadSheet />
      </header>

    </div>
  );
}

export default App;


