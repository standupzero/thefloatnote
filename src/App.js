import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import { useTransition, useSpring, animated } from 'react-spring';

import Todo from './components/Todo2.js';

function LayoutTop() {

  const [show, setShow] = useState(true)
  const transitions = useTransition(show, null, {
  from: { position: 'absolute', opacity: 0 },
  enter: { opacity: 1 },
  leave: { opacity: 0 },
})

  return(
    <div className="LayoutTop">
            {transitions.map(({ item, key, props }) =>
              item && <animated.h1 key={key} style={{ ...props, color: 'black'}} onClick={() => setShow(false)}>CLICK ME TO DISSAPEAR</animated.h1>
)}
    </div>
    )
}

function ModuleFrame(props) {
  return (
    <div className="BookWrapper">
      <div className="BookWrapper-left">
        {props.left}
      </div>
      <div className="BookWrapper-main">
        {props.main}
      </div>
      <div className="BookWrapper-Right">
        {props.right}
      </div>
    </div>
    )
}

function LayoutMid() {


  return(
    <div className="LayoutMid">
      <ModuleFrame
        left={
          <div>
            <h1> First Note </h1>
            <p> In this application,
            the philosophy is to working things in horizontal manner
            </p>
            <p> A minmal expierence for offline line productivity</p>
            <p> Modular Experience </p>
\
            
          </div>
        }
        main={
            <Todo />
        }
      />
      
    </div>
    )
}


function LayoutBot() {
  return(
    <div className="LayoutBot">
     <p>Helloo, this application is created by brandon lok</p>
    </div>
    )
}


function LayoutApp() {
  return(
    <div className="AppWrapper">
      <LayoutTop/>
      <LayoutMid/>
      <LayoutBot/>
    </div>
    )
}




function App() {
 
  const props = useSpring({opacity: 1, config: { duration: 1500}, from: {opacity: 0}})


  
  
  return (
    <div style={props} className="App">
      <LayoutApp />
    </div>
  );
}


export default App;

