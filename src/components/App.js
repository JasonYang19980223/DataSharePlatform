import React, { Component } from 'react';
import Nbar from './Nbar.js';
import web3 from './web3.js'
import platform from './contract/platform.js'


class App extends Component {

  constructor(props){
    super(props)
    this.state = {
      contract:platform,
      account:''
    }    
  }

  async componentWillMount() {
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const pm = await this.state.contract.methods.manager().call();
    if(this.state.account === pm){
      this.setState({manager:true});
    }
    else
      this.setState({manager:false});
  }

  render() {
    const imgStyle ={
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    };
    return (
      <div className="Home">
        <Nbar account={this.state.account} manager ={this.state.manager}/>
        <br/>
        <br/>
        <div style={imgStyle}>
          <img atyle={{margin:'10px'}}src={require('../images/org.png')} height = '200px' weight = '200px' alt ="something wrong img cant show"/>
          <img src={require('../images/joinIcon.png')}alt ="something wrong img cant show"/>
          <img atyle={{margin:'10px'}}src={require('../images/org.png')} height = '200px' weight = '200px' alt ="something wrong img cant show"/>
        </div>
      </div>
    );
  }
}

export default App;