import React from 'react';
import { useNavigate } from 'react-router-dom';
import './search.css';
import PrettoSlider from './PrettoSlider';
import SearchIcon from '@mui/icons-material/Search';

const Search = () => {
  const [type, setType] = React.useState('name');
  const [name, setName] = React.useState('');
  const [id, setId] = React.useState('');
  localStorage.setItem('start', 1938);
  localStorage.setItem('end', 2023)
  localStorage.setItem('k', 2);
  const [start, setStart] = React.useState(1938)
  const [end, setEnd] = React.useState(2023)
  const [k, setK] = React.useState(2)
  const navigate = useNavigate();

  const submit = () => {
    let key = '';
    if (type === 'name') {
      key = name;
    } else {
      key = id;
    }
    if (key === '') {
      alert('Alert: ' + type + ' cannot be empty!');
    } else if (isNaN(parseInt(start)) || isNaN(parseInt(end))) {
      alert('year is not number')
    } else if (parseInt(start) < 1938 || parseInt(end) > 2023) {
      alert('year query out of bound')
    } else if (parseInt(start) > parseInt(end)) {
      alert('start year should earlier or equal to end year')
    } else {
      localStorage.setItem('start', start);
      localStorage.setItem('end', end)
      localStorage.setItem('k', k);
      navigate('/'+type+'/'+key)
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
      </div>
      <div className='yearInput'>
        <p className='minmax'>Year selected: ( <b>{start}</b> ················ <b>{end}</b> )</p>
        <PrettoSlider
          value={ [start, end] }
          min={1938}
          max={2023}
          valueLabelDisplay="auto"
          onChange={(e) => {
            setStart(e.target.value[0])
            setEnd(e.target.value[1])
          }}
        />
        <p className='minmax'> K value selected: ( <b>{k}</b> )</p>
        <PrettoSlider
          value={k}
          aria-label="Default"
          min={1}
          max={20}
          valueLabelDisplay="auto"
          onChange={(e) => {
            setK(e.target.value)
          }} />
      </div>
      
      <button
        className='Submit'
        onClick={() => submit()}
      ><SearchIcon fontSize="large" /></button>
    </div>
  )
}

export default Search;

