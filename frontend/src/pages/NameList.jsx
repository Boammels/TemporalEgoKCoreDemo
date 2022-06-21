import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './search.css'

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
  const myfetch = async () => { 
    axios.get('http://127.0.0.1:5000/name/',
      { 
        params : {
          'name': name
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

  return (
    <><div className='main'>
        <div className='searchbar' >
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
          <button
            className='btn-sml'
            onClick={() => {k > 0 ? setK(k-1) : setK(k)}}
          >-</button>
          <span> k = {k} </span>
          <button
            className='btn-sml'
            onClick={() => {k < 20 ? setK(k+1) : setK(k)}}
          >+</button>
          <input
            type='text'
            value={name}
            className='Input2'
            placeholder='Name of the researcher'
            onChange={e => setName(e.target.value)}
          />
          <button
            className='btn-medium1'
            onClick={() => submit()}
          >Search</button>
          <button
            className='btn-medium2'
            onClick={() => navigate('')}  
          >Cancel</button>
        </div>
        <div>
          {success && names.map((name) => {
            return (<>
              <a
                key={name.id}
                href={'http://localhost:3000/id/'+name.id +'/'+start+'/'+end+'/'+k}
              >
                <div className='nameListItem'>
                  <p>{name.name}</p>
                </div>
              </a>
            </>);
          })}
        </div>
        {names.length === 0 && success && <p className='line'>No results for '{searchName}'</p>}
        {names.length === 0 && !success && <p className='line'>Loading......</p>}
        <div style={{height:'100px', width:'100%'}}></div>
      </div>
    </>
  )
}

export default NameList;