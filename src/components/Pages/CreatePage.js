import React, { Component } from 'react';
import web3 from '../Load/web3.js'
import Create from './Create.js'
import platform from '../Load/platform.js'
import Nbar from '../Nbar.js';

class CreatePage extends Component {

  constructor(props){
    super(props)
    this.state = {
      account: '',
      manager:'',
      name:'',
      phone:'',
      email:'',
      isLogIn:false
    }    
  }
  async componentWillMount() {
    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0] })

    const pm = await platform.methods.manager().call();
    if(this.state.account === pm){
      this.setState({manager:true});
    }
    else
      this.setState({manager:false});
    await this.check()
  }

  async check(){
    let log =await platform.methods.memberCheck(this.state.account).call()
    this.setState({isLogIn:log})
    if(this.state.isLogIn){
      let mem = await platform.methods.members(this.state.account).call()
      this.setState({name:mem.name})
      this.setState({phone:mem.phone})
      this.setState({email:mem.email})
    }
  }

  render() {
    let page;
    if(this.state.isLogIn!==true){
      page=<Create/>;
    }
    else{
      page=(
        <div>
          <Nbar account={this.state.account} manager={this.state.manager}/>
          <div stlye={{margin:"5px"}}>
            <h1>You are already a member</h1>
            <h2>Name:{this.state.name}</h2>
            <h2>Email:{this.state.phone}</h2>
            <h2>Email:{this.state.email}</h2>
          </div>
        </div>
      );
    }
    return(
      <div>
        {page}
      </div>
    );
  }
}


export default CreatePage;