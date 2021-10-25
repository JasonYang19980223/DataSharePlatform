import React, { Component } from 'react';
import Nbar from './Nbar.js';
import storage from './storage.js'



class App extends Component {
  

  async componentWillMount() {
    await this.loadData()
  }

  async loadData() {
    console.log(await storage.methods.retrieve().call());
  }


  constructor(props){
    super(props)
    this.state = {
      contract:'',
    }    
  }

  render() {
    return (
      <div className="Home">
        <Nbar/>
      </div>
    );
  }
}

export default App;