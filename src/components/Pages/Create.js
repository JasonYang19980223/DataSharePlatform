import React, { Component } from 'react';
import web3 from '../Load/web3.js'
import platform from '../Load/platform.js'
import Nbar from '../Nbar.js';


//********創建成員的介面***********
class Create extends Component {

  constructor(props){
    //account 使用者的地址
    //orgnizationName 組織註冊的名稱
    //phone 組織註冊的電話
    //email 組織註冊的信箱
    super(props)
    this.state = {
      account: '',
      orgnizationName:'',
      phone:'',
      email:''
    }    
    this.handleName = this.handleName.bind(this);
    this.handlePhone = this.handlePhone.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  //進入頁面前先進行初始化，設定使用者地址，並確認是否為管理者
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

  //設定組織名稱
  handleName(e) {
    this.setState({orgnizationName: e.target.value});
  }

  //設定組織手機
  handlePhone(e) {
    this.setState({phone: e.target.value});
  }

  //設定組織信箱
  handleEmail(e) {
    this.setState({email: e.target.value});
  }

  //設定送出，紀錄上鏈
  async handleClick(e) {
    await platform.methods.createMember(this.state.orgnizationName,this.state.email,this.state.phone).send({ from: this.state.account })
    console.log(this.state.orgnizationName);
  }

  //顯示輸入框和對應function
  render() {
    const styleInput={
      border:'2px solid'
    };
    return (
      <div>
        <Nbar account={this.state.account} manager ={this.state.manager}/>
        <form style={{margin:'5px'}}>
          <label>
            <input type="text" placeholder="orginization name" style={styleInput} onChange={ this.handleName } />
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