import React from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import { useNavigate, useParams } from 'react-router-dom';
import './Graph.css';
import axios from 'axios';

const Graph = () => {
  const [success, setSuccess] = React.useState(false);
  const [elements, setElement] = React.useState([]);
  const [center, setCenter] = React.useState('')
  const id = useParams().id;
  const start = parseInt(useParams().start);
  const end = parseInt(useParams().end);
  const k = parseInt(useParams().k);
  const navigate = useNavigate();
  const load = 1;

  const myfetch = async () => { 
    axios.get('http://127.0.0.1:5000/id/',
      { 
        params : {
          'id': id,
          'start': start,
          'end': end,
          'k': k
        }
      }).then(({ data }) => {
        setElement(data.elements)
        setCenter(data.author)
        setSuccess(true)
      }
    )
    .catch((err) => {
      alert(err.message);
      navigate('/');
    });
  }
  // eslint-disable-next-line
  React.useEffect(() => myfetch, [load])

  return <>
    {success && elements.length !== 0 && <CytoscapeComponent
      elements={elements}
      style={{width: '100vw', height: 'calc(100vh - 50px)'}}
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
    {success && elements.length === 0 && <div className='main'>
      <p className='line'>There isn't a <b>{k}</b>-core subgraph</p>
      <p className='line'>for <u><b>{center}</b></u> from <b>{start}</b> to <b>{end}</b>.</p>
      <button
        className='button'
        onClick={() => navigate('/')}
      >Search for others</button>
    </div>}
    {!success && <div className='main'>
      <p className='line'><b>Loading......</b></p>
    </div>}
  </>
}

export default Graph;
