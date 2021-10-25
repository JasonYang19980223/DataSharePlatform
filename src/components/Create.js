import React, { Component } from 'react';
import web3 from './web3.js'
import Nbar from './Nbar.js';
import storage from './storage.js'

class Create extends Component {

  constructor(props){
    super(props)
    this.state = {
      account: '',
      num:5,
      submitNum:0
    }    
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(e) {
    this.setState({num: e.target.value});
  }

  async handleClick(e) {
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    this.setState({submitNum:this.state.num})
    await storage.methods.store(parseInt(this.state.submitNum)).send({ from: this.state.account })
    console.log(this.state.submitNum);
  }

  render() {
    return (
      <div>
        <Nbar account={this.state.account}/>
        <h1>
          create member
        </h1>
        <div>
          <input type="text" onChange={ this.handleChange } />
          <input
            type="button"
            value="store num"
            onClick={this.handleClick}
          />
        </div>
        <h3>storage: {this.state.submitNum}</h3>
      </div>
    );
  }
}


export default Create;