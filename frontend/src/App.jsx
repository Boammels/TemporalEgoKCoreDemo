import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import './App.css';
import Graph from './pages/Graph' 
import Search from './pages/Search'

function App() {
  return (
    <BrowserRouter>
      <header className='header'>
        <p className='text'>Welcome!</p>
      </header>
      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/echo" element={<Echo />} />
        <Route path="/id/:id/:start/:end/:k" element={<Graph />} />
      </Routes>
    </BrowserRouter>
  );
}

const Echo = () => {
  const [string, setString] = React.useState('')
  const [success, setSuccess] = React.useState(false);
  React.useState(
    async () => {
      const response = await fetch('http://127.0.0.1:5000/echo/post/', {
        method: 'GET',
        headers : { 
          'Content-Type': 'application/json',
        }
      });
      const result = await response.json();
      if(response.status === 200) {
        setString(result.echo);
        setSuccess(true);
      }
    }
  )
  return (
    <>
    {success && <h1>{string}</h1>}
    </>
  )
}

export default App;
