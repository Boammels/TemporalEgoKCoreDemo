import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './search.css'
import PrettoSlider from './PrettoSlider'

const NameList = () => {
  const [start, setStart] = React.useState(parseInt(useParams().start));
  const [end, setEnd] = React.useState(parseInt(useParams().end));
  const [k, setK] = React.useState(parseInt(useParams().k)) ;
  const [names, setNames] = React.useState([]);
  const [success, setSuccess] = React.useState(false);
  const [name, setName] = React.useState(useParams().name);
  const navigate = useNavigate();
  let load = 1;
  const searchName = useParams().name
  const m_end = parseInt(useParams().end)
  const m_start = parseInt(useParams().start)
  const myfetch = async () => { 
    axios.get('http://127.0.0.1:5000/name/',
      { 
        params : {
          'name': name,
          'start': m_start,
          'end': m_end,
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
      navigate('/name/'+name+'/'+parseInt(start)+'/'+parseInt(end)+'/'+k)
      window.location.reload()
    }
  }

  const goto = (id) => {
    navigate('/id/' + id + '/' + m_start + '/' + m_end + '/' + k);
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
                  setStart(e.target.value[0]);
                  setEnd(e.target.value[1]);
                }}
              />
            </div>
            <div className='child'>
              <p className='minmax'> K value selected: ( <b>{k}</b> )</p>
              <PrettoSlider
                value={k}
                aria-label="Default"
                min={0}
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
              backgroundColor: (start !== m_start || end !== m_end) ?  '#b59a48' : '#6f926e',
              borderColor: (start !== m_start || end !== m_end) ? '#b59a48' : '#6f926e'
            }}
          >Search</button>
          <button
            className='btn-medium2'
            onClick={() => navigate('/')}  
          >Cancel</button>
        </div>
        {(start !== m_start || end !== m_end) && <p>Your query time has changed and the seaching results for names may have changed. Click Search to reload the authors.</p>}
        {names.lendth !== 0 && success && <p>Results for '{searchName}' from {m_start} to {m_end}</p>}
        <div>
          {success && names.map((name) => {
            return (<>
              <button
                key={name.id}
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
        {names.length === 0 && success && <p className='line'>No results for '{searchName}' from {m_start} to {m_end}</p>}
        {names.length === 0 && !success && <p className='line'>Loading......</p>}
        <div style={{height:'100px', width:'100%'}}></div>
      </div>
    </>
  )
}

export default NameList;