import React, { Component } from 'react';
import Nbar from './Nbar.js';



class App extends Component {

  constructor(props){
    super(props)
    this.state = {
      contract:'',
    }    
  }

  render() {
    const imgStyle ={
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    };
    return (
      <div className="Home">
        <Nbar/>
        <br/>
        <br/>
        <div style={imgStyle}>
          <img atyle={{margin:'10px'}}src={require('../images/org.png')} height = '200px' weight = '200px'/>
          <img src={require('../images/joinIcon.png')}/>
          <img atyle={{margin:'10px'}}src={require('../images/org.png')} height = '200px' weight = '200px'/>
        </div>
      </div>
    );
  }
}

export default App;