import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import './App.css';
import Graph from './pages/Graph' 
import Search from './pages/Search'
import NameList from './pages/NameList'

function App() {
  return (
    <BrowserRouter>
      <header className='header'>
        <a className='webName' href='/'>DBLP Ego-network K-core Calculator</a>
      </header>
      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/echo" element={<Echo />} />
        <Route path="/id/:id/" element={<Graph />} />
        <Route path="/name/:name/" element={<NameList />} />
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
