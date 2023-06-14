import React from 'react';
import './App.css';
import Machine from './Engine/Machine';
import CalculatorInputProcessor from './Components/CalculatorInputProcessor';

function App() {
  const machine = new Machine(5,8);
  return (
    <div className="App">
      <header className="App-header">
       
      <CalculatorInputProcessor machine={machine}/>
      
        

      </header>
      
    </div>
  );
}

export default App;
