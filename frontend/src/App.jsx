import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import CytoscapeComponent from 'react-cytoscapejs';
import './App.css';

function App() {

  return (
    <BrowserRouter>
      <header className='header'>
        <p className='text'>Welcome!</p>
      </header>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="try" element={<Graph />} />
      </Routes>
    </BrowserRouter>
  );
}

const Graph = () => {
  const [success, setSuccess] = React.useState(false);
  const [elements, setElement] = React.useState([]);

  React.useState(
    async () => {
      const response = await fetch('data.json',{
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
         }
      });
      const result = await response.json();
      if(response.status === 200) {
        setElement(result.elements);
        setSuccess(true);
        console.log(elements)
      }
    }
  )

  return <>
      {success &&
      <CytoscapeComponent
        elements={elements}
        style={ { width: '100vw', height: 'calc(100vh - 50px)'}}
        stylesheet={[
          {
            selector: 'node',
            style: {
              width: 20,
              height: 20,
              color: 'black',
              label: 'data(label)'
            }
          },
          {
            selector: 'edge',
            style: {
              width: 1,
              color: '#123333'
            }
          }
        ]}
        layout={{
          name:'circle'
        }}
      />}
    </>
}

const Start = () => {
  const [type, setType] = React.useState('name');
  const [name, setName] = React.useState('');
  const [id, setId] = React.useState('');

  const submit = () => {
    let key = '';
    if (type === 'name') {
      key = name;
    } else {
      key = id;
    }
    if (key === '') {
      alert('Alert: ' + type + ' cannot be empty!');
    } else {
      console.log(key);
    }
  }

  return (
    <div className='main'>
      <div className='typeSelect'> 
        <input
          type='checkbox'
          className='checkbox'
          checked={type==='id'}
          style={{ display:'inline' }}
          onChange={() => {
            if (type === 'name') {
              setType('id');
            } else {
              setType('name')
            }
          }}
        />
        <span className='text'>Search by ID | </span>
        <input
          type='checkbox'
          className='checkbox'
          checked={type==='name'}
          style={{ display:'inline' }}
          onChange={() => {
            if (type === 'name') {
              setType('id');
            } else {
              setType('name')
            }
          }}
        />
        <span className='text'>Search by Name</span>
      </div>
      {type==='name' && <input
        type='text'
        value={name}
        className='Input'
        placeholder='Name of the researcher'
        onChange={e => setName(e.target.value)}
      />}
      {type==='id' && <input
        type='text'
        value={id}
        className='Input'
        placeholder='ID of the researcher'
        onChange={e => setId(e.target.value)}
      />}
      <button
        onClick={() => submit()}
      >Let's Start!</button>
    </div>
  )
}

export default App;
