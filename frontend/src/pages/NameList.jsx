import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './search.css';
import PrettoSlider from './PrettoSlider';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const NameList = () => {
  const [start, setStart] = React.useState(parseInt(localStorage.getItem('start')));
  const [end, setEnd] = React.useState(parseInt(localStorage.getItem('end')));
  const [k, setK] = React.useState(parseInt(localStorage.getItem('k'))) ;
  const [names, setNames] = React.useState([]);
  const [success, setSuccess] = React.useState(false);
  const [name, setName] = React.useState(useParams().name);
  const navigate = useNavigate();
  let load = 1;
  const searchName = useParams().name;
  const myfetch = async () => { 
    axios.get('http://127.0.0.1:5000/name/',
      { 
        params : {
          'name': name,
          'start': localStorage.getItem('start'),
          'end': localStorage.getItem('end'),
        }
      }).then(({ data }) => {
        setNames(data.names);
        console.log(names);
        setSuccess(true);
      }
    )
    .catch((err) => {
      alert(err.message);
      navigate('');
    });
  }
  // eslint-disable-next-line
  React.useEffect(() => myfetch, [load])

  const submit = () => {
    setSuccess(false)
    if (name === '') {
      alert('Alert: name cannot be empty!');
    } else if (isNaN(parseInt(start)) || isNaN(parseInt(end))) {
      alert('year is not number')
    } else if (parseInt(start) < 1938 || parseInt(end) > 2023) {
      alert('year query out of bound')
    } else if (parseInt(start) > parseInt(end)) {
      alert('start year should earlier or equal to end year')
    } else {
      localStorage.setItem('k', k)
      localStorage.setItem('start', start)
      localStorage.setItem('end', end)
      navigate('/name/'+name)
      window.location.reload()
    }
  }

  const goto = (id) => {
    localStorage.setItem('k', k)
    navigate('/id/' + id + '/');
  }

  return (
    <>
      <div className='main2'>
        <div className='searchbar' >
          <input
            type='text'
            value={name}
            className='Input2'
            placeholder='Name of the researcher'
            onChange={e => setName(e.target.value)}
          />
          <div className='parent'>
            <div className='child'>
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
            </div>
            <div className='child'>
              <p className='minmax'> K value selected: ( <b>{k}</b> )</p>
              <PrettoSlider
                value={k}
                aria-label="Default"
                min={1}
                max={20}
                valueLabelDisplay="auto"
                onChange={(e) => {
                  setK(e.target.value)
                }}
              />
            </div>
          </div>
          <button
            className='btn-medium1'
            onClick={() => submit()}
            style={{
              backgroundColor: (start !== parseInt(localStorage.getItem('start')) || end !== parseInt(localStorage.getItem('end'))) ?  '#b59a48' : '#6f926e',
              borderColor: (start !== parseInt(localStorage.getItem('start')) || end !== parseInt(localStorage.getItem('end'))) ? '#b59a48' : '#6f926e'
            }}
          ><CheckCircleIcon /></button>
          <button
            className='btn-medium2'
            onClick={() => navigate('/')}  
          ><CancelOutlinedIcon /></button>
        </div>
        {(start !== parseInt(localStorage.getItem('start')) || end !== parseInt(localStorage.getItem('end'))) && <p>Your query time has changed and the seaching results for names may have changed. Click Search to reload the authors.</p>}
        {names.lendth !== 0 && success && <p>Results for '{searchName}' from {localStorage.getItem('start')} to {localStorage.getItem('end')}</p>}
        <div>
          {success && names.map((name, index) => {
            return (<>
              <button
                key={index}
                className='Results'
                onClick = {() => goto(name.id)}
              >
                <div className='nameListItem'>
                  <p><b>{name.name.length > 20 ? name.name.slice(0,17) + '...' : name.name}</b></p>
                  <p>ID:{name.id}</p>
                </div>
              </button>
            </>);
          })}
        </div>
        {names.length === 0 && success && <p className='line'>No results for '{searchName}' from {localStorage.getItem('start')} to {localStorage.getItem('end')}</p>}
        {names.length === 0 && !success && <p className='line'>Loading......</p>}
        <div style={{height:'100px', width:'100%'}}></div>
      </div>
    </>
  )
}

export default NameList;