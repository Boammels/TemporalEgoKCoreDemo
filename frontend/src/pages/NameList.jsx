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
  const name = useParams().name;
  const navigate = useNavigate();
  const load = 1;

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
        </div>
        <div>
          {success && names.map((name) => {
            return (<>
              <a
                key={name.id}
                href={'id/'+name.id +'/'+start+'/'+end+'/'+k}
              >
                <div className='nameListItem'>
                  <p>{name.name}</p>
                </div>
              </a>
            </>);
          })}
        </div>
        <div style={{height:'100px', width:'100%'}}></div>
      </div>
    </>
  )
}

export default NameList;