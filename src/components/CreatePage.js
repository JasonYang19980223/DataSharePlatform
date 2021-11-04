import React, { Component } from 'react';
import web3 from './web3.js'
import Create from './Create.js'
import platform from './contract/platform.js'
import Nbar from './Nbar.js';

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
  }

  render() {
    let page;
    if(!this.state.isLogIn){
      page=<Create/>;
    }
    else{
      page=(
        <React.Fragment>
          <Nbar account={this.state.account}/>
          <h1>You are the member</h1>
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