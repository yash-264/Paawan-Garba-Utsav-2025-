import { useState, useEffect } from 'react';
import Page from './Components/Page';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  
  return (
    <>
      <Page />
    </>
  );
}

export default App;
