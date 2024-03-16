import { useState } from 'react';
import './App.css';
import RGBDistortion from './RGBDistortion';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <RGBDistortion />
    </>
  );
}

export default App;
