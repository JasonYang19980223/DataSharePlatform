import React, { Component } from 'react';
import web3 from './web3.js'
import Nbar from './Nbar.js';
import member from './contract/member.js'

class Create extends Component {

  constructor(props){
    super(props)
    this.state = {
      account: '',
      name:'',
      phone:'',
      email:'',
      address:''
    }    
    this.handleName = this.handleName.bind(this);
    this.handlePhone = this.handlePhone.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handleAddress = this.handleAddress.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleName(e) {
    this.setState({name: e.target.value});
  }

  handlePhone(e) {
    this.setState({phone: e.target.value});
  }

  handleEmail(e) {
    this.setState({email: e.target.value});
  }

  handleAddress(e) {
    this.setState({address: e.target.value});
  }

  async handleClick(e) {
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    await member.methods.createMember(this.state.name,this.state.email,0,23).send({ from: this.state.account })
    console.log(this.state.name);
  }

  render() {
    const styleInput={
      border:'2px solid'
    };
    return (
      <div>
        <Nbar account={this.state.account}/>
        <form style={{margin:'5px'}}>
          <label>
            <input type="text" placeholder="name" style={styleInput} onChange={ this.handleName } />
          </label>
          <br/>
          <label>
            <input type="text" placeholder="phone" style={styleInput} onChange={ this.handlePhone } />
          </label>
          <br/>
          <label>
            <input type="text" placeholder="email" style={styleInput} onChange={ this.handleEmail } />
          </label>
          <br/>
          <label>
            <input type="text" placeholder="address" style={styleInput} onChange={ this.handleAddress } />
          </label>
          <br/>
          <label>
            <input
              type="button"
              value="confirm"
              style={{cursor:'pointer'}}
              onClick={this.handleClick}
            />
          </label>
        </form>
      </div>
    );
  }
}


export default Create;