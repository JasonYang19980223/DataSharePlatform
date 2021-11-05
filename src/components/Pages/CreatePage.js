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
      isLogIn:false
    }    
  }
  async componentWillMount() {
    const pm = await platform.methods.manager().call();
    if(this.state.account === pm){
      this.setState({manager:true});
    }
    else
      this.setState({manager:false});
    await this.check()
  }

  async check(){
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    this.setState({isLogIn: await platform.methods.memberCheck(this.state.account).call()})
    if(this.state.isLogIn){
      let mem = await platform.methods.members(this.state.account).call()
      this.setState({name:mem.name})
      this.setState({phone:mem.phone})
      this.setState({email:mem.email})
    }
  }

  render() {
    let page;
    if(!this.state.isLogIn){
      page=<Create/>;
    }
    else{
      page=(
        <React.Fragment>
          <div stlye={{margin:"5px"}}>
            <Nbar account={this.state.account}/>
            <h1>You are already a member</h1>
            <h2>Name:{this.state.name}</h2>
            <h2>Email:{this.state.phone}</h2>
            <h2>Email:{this.state.email}</h2>
          </div>
        </React.Fragment>
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