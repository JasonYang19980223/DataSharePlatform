import React, { Component } from 'react';
import web3 from '../Load/web3.js'
import Create from './Create.js'
import platform from '../Load/platform.js'
import Nbar from '../Nbar.js';


//********創建成員的介面***********
class CreatePage extends Component {
  //account 使用者的地址
  //manager 發布合約的地址
  //name 組織註冊的名稱
  //phone 組織註冊的電話
  //email 組織註冊的信箱
  //isLogIn 該地址是否已成為成員
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

  //進入頁面前先進行初始化，設定使用者地址，判斷是否為管理者
  //呼叫function check來判定是否已註冊成員
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

  //呼叫合約中的memberCheck這個mapping來判定該組織是否已成為成員
  async check(){
    let log =await platform.methods.memberCheck(this.state.account).call()
    this.setState({isLogIn:log})
    //若已成為成員，頁面顯示成員的基本資料
    if(this.state.isLogIn){
      let mem = await platform.methods.members(this.state.account).call()
      this.setState({name:mem.orgnizationName})
      this.setState({phone:mem.phone})
      this.setState({email:mem.email})
    }
  }

  //頁面互動顯示程式碼
  render() {
    let page;
    //利用isLogIn變數來決定顯示的介面為何
    if(this.state.isLogIn!==true){
      //顯示Create.js
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