import React, { Component } from 'react';
import web3 from '../Load/web3.js'
import Nbar from '../Nbar.js';
import platform from '../Load/platform.js'
import history from '../../History';

//********成員基本資訊和參與了什麼合作案的介面***********
class MemberInform extends Component {
  
  constructor(props){
    //account 使用者的地址
    //name 該組織的名稱
    //phone 該組織的電話
    //email 該組織的信箱
    //cooperations 該組織參與的合作案列表
    super(props)
    this.state = {
      account:'',
      name:'',
      phone:'',
      email:'',
      cooperations:[],
      isLogIn:false
    }
  }

  //進入頁面前先進行初始化，設定使用者地址，並確認是否為管理者 
  //call getInit() 來獲取該成員參與的合作案 
  async componentWillMount() {
    await this.check()

    const pm = await platform.methods.manager().call();
    if(this.state.account === pm){
      this.setState({manager:true});
    }
    else
      this.setState({manager:false});

    if(this.state.isLogIn)
      await this.getInit()
  }

  //判斷該組織是否已成為成員
  async check(){
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    this.setState({isLogIn: await platform.methods.memberCheck(this.state.account).call()})
  }

  //獲取該成員參與的基本資訊和合作案
  async getInit(){
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    
    //獲取基本資訊
    let m =await platform.methods.members(this.state.account).call()
    this.setState({ name: m.orgnizationName })
    this.setState({ phone: m.phone })
    this.setState({ email: m.email })

    //獲取合作案
    for(let i = 0;i<m.cooCnt;i++){
      let coo = await platform.methods.getCooperation(this.state.account,i).call()
      this.setState({
        cooperations: [...this.state.cooperations,coo]
      })
    }

  }

  //點擊button: col跳轉到MemberCols 判斷提供了什麼欄位
  //param: 合作案ID、成員地址
  async handleCol(cooID,memaddress) {
    let path = "/MemberCols"; 
    history.push({
      pathname:path,
      state:{
        cooperationID:cooID,
        memberAddress:memaddress
      }
    });
  }

  render() {
    return (
      <div>
        <Nbar account={this.state.account} manager ={this.state.manager}/>
        <h3>Account: {this.state.account}</h3>
        <br/>
        <h3>Name: {this.state.name}</h3>
        <br/>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">cooperation</th>
              <th scope="col">data</th>
              <th scope="col">result</th>
            </tr>
          </thead>
          <tbody id="request">
            { this.state.cooperations.map((coo, key) => {
              return(
                <tr key={key}>
                  <th scope="row">{coo.cooperationID}</th>
                  <td>{coo.target}</td>
                  <td>                    
                    <input
                      type = "button"
                      value="col"
                      style={{cursor:'pointer'}}
                      onClick={()=>this.handleCol(coo.cooperationID,this.state.account)}
                    />
                  </td>
                  <td>waiting</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <br/>
      </div>
    );
  }
}


export default MemberInform;