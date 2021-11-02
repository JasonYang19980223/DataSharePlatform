import React, { Component } from 'react';
import web3 from './web3.js'
import Nbar from './Nbar.js';
import platform from './contract/platform.js'
import history from '../History';

class Request extends Component {

  constructor(props){
    super(props)
    this.state = {
      account:'',
      column:'',
      privacy:0,
      discription:''
    }    
    this.handleCol = this.handleCol.bind(this);
    this.handlePrivacy = this.handlePrivacy.bind(this);
    this.handleDiscription = this.handleDiscription.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  async componentWillMount() {
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] })
    const pm = await platform.methods.manager().call();
    console.log(pm);
    if(this.state.account == pm){
      this.setState({manager:true});
    }
    else
      this.setState({manager:false});
  }

  handleCol(e) {
    this.setState({column: e.target.value});
  }

  handlePrivacy(e) {
    this.setState({privacy: parseInt(e.target.value)});
  }

  handleDiscription(e) {
    this.setState({discription: e.target.value});
  }

  async handleClick(e) {
    await platform.methods.createRequest(this.state.column,this.state.privacy,this.state.discription).send({ from: this.state.account })
    let path = "/Upload"; 
    history.push(path);
  }

  render() {
    const styleInput={
      border:'2px solid'
    };
    return (
      <div>
        <Nbar account={this.state.account} manager={this.state.manager}/>
        <form style={{margin:'5px'}}>
          <label>
            <input type="text" placeholder="column" style={styleInput} onChange={ this.handleCol } />
          </label>
          <br/>
          <label>
            <input type="text" placeholder="privacy" style={styleInput} onChange={ this.handlePrivacy } />
          </label>
          <br/>
          <label>
            <input type="text" placeholder="discription" style={styleInput} onChange={ this.handleDiscription } />
          </label>
          <br/>
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


export default Request;