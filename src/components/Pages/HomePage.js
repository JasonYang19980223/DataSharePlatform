import React, { Component } from 'react';
import Nbar from '../Nbar.js';
import web3 from '../Load/web3.js'
import platform from '../Load/platform.js'

//********創建主頁畫面***********
class HomePage extends Component {
  //account 使用者的地址
  constructor(props){
    super(props)
    this.state = {
      account:''
    }    
  }

  //進入頁面前先進行初始化，用來顯示使用者的地址及確定是否為管理者
  async componentWillMount() {
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const pm = await platform.methods.manager().call();
    if(this.state.account === pm){
      this.setState({manager:true});
    }
    else
      this.setState({manager:false});
  }

  //顯示主頁畫面
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
          <img atyle={{margin:'10px'}}src={require('../../images/org.png')} height = '200px' weight = '200px' alt ="something wrong img cant show"/>
          <img src={require('../../images/joinIcon.png')}alt ="something wrong img cant show"/>
          <img atyle={{margin:'10px'}}src={require('../../images/org.png')} height = '200px' weight = '200px' alt ="something wrong img cant show"/>
        </div>
      </div>
    );
  }
}

export default HomePage;