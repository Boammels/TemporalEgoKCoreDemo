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
  const start = localStorage.getItem('start');
  const end = localStorage.getItem('end');
  const k = localStorage.getItem('k');
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
        console.log(data.author_list)
        setSuccess(true)
      }
    )
    .catch((err) => {
      alert(err.message);
      navigate('/');
    });
  }
  /*var myCyRef = undefined;
  const checkedge = (ele, myCyRef) => {
    if (myCyRef.get(ele.data('source')).selected || myCyRef.get(ele.data('target')).selected) {
      return true;
    }
  }*/
  // eslint-disable-next-line
  React.useEffect(() => myfetch, [load])
  const str = '<id = ' + id + '>'
  return <>
    {success && elements.length !== 0 && <CytoscapeComponent
      elements={elements}
      style={{width: '100vw', height: 'calc(100vh - 100px)', backgroundColor: '#DBE2E9'}}
      //cy={(cy) => {myCyRef = cy}}
      stylesheet={[
        {
          selector: 'node',
          style: {
            'width': 20,
            'height': 20,
            'label': 'data(label)',
            "background-color": (ele) => {return ele.data('label') === center ? '#b59a48' : '#6f926e' },
            "color": 'black'
          },
          onClick: (ele) => console.log(ele.data('id'))
        },
        {
          selector:'node:selected',
          style: {
            'background-color': '#516e8a'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 1,
            'border-color': 'red'
            //'background-color': (ele, myCyRef) => {return checkedge(ele, myCyRef) ? '#516e8a' : '#DBE2E9'}
          }
        }
      ]}
      layout={{
        name:'circle'
      }}
      panningEnabled={true}
      //zoomingEnabled={false}
      zoom={0.9}
      minZoom={0.9}
      maxZoom={0.9}
      selectionType='single'

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
    <div className='desc'>
      <p>{k}-core of the Ego Network for {success && <u>{center}</u>} {!success && <u>{str}</u>} from {start} to {end}</p>
    </div>
  </>
}

export default Graph;
