import React from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import { useNavigate, useParams } from 'react-router-dom';
import '../App.css';
import axios from 'axios';

const Graph = () => {
  const [success, setSuccess] = React.useState(false);
  const [elements, setElement] = React.useState([]);
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
    {success && <CytoscapeComponent
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
  </>
}

export default Graph;
