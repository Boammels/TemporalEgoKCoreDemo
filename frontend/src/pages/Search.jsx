import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Search = () => {
  const [type, setType] = React.useState('name');
  const [name, setName] = React.useState('');
  const [id, setId] = React.useState('');
  const [start, setStart] = React.useState(1938)
  const [end, setEnd] = React.useState(2023)
  const navigate = useNavigate()

  const submit = () => {
    let key = '';
    if (type === 'name') {
      key = name;
    } else {
      key = id;
    }
    console.log(start)
    console.log(end)
    if (key === '') {
      alert('Alert: ' + type + ' cannot be empty!');
    } else if (isNaN(parseInt(start)) || isNaN(parseInt(end))) {
      alert('year is not number')
    } else if (parseInt(start) < 1938 || parseInt(end) > 2023) {
      alert('year query out of bound')
    } else if (parseInt(start) > parseInt(end)) {
      alert('start year should earlier or equal to end year')
    } else {
      navigate('/'+type+'/'+key+'/'+parseInt(start)+'/'+parseInt(end)+'/7')
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
        type='number'
        value={id}
        className='Input'
        placeholder='ID of the researcher'
        onChange={e => setId(e.target.value)}
      />}
      <div className='yearInput'>
        From: <input
          type='number'
          className='year'
          value={start}
          min={1938}
          max={2023}
          onChange={e => setStart(e.target.value)}
        /> To: <input
          type='number'
          className='year'
          value={end}
          min={1938}
          max={2023}
          onChange={e => setEnd(e.target.value)}
        />
        <p className='minmax'>(min: 1938, max: 2023)</p>
      </div>
      <button
        onClick={() => submit()}
      >Let's Start!</button>
    </div>
  )
}

export default Search