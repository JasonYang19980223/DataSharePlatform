import React, { Component } from 'react';
import web3 from '../Load/web3.js'
import Nbar from '../Nbar.js';
import platform from '../Load/platform.js'
import history from '../../History';

//********合作案清單的介面***********
class CooperationList extends Component {
  
  //account 使用者的地址
  //cooperations 合作案的list
  constructor(props){
    super(props)
    this.state = {
      account: '',
      cooperations:[]
    }
    this.handleCooperation= this.handleCooperation.bind(this);
    this.handleJoin= this.handleJoin.bind(this);
  }

  //進入頁面前先進行初始化，設定使用者地址，並確認是否為管理者 
  //call getInit() 來獲取當前的所有合作案
  async componentWillMount() {
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const pm = await platform.methods.manager().call();
    if(this.state.account === pm){
      this.setState({manager:true});
    }
    else
      this.setState({manager:false});
    await this.getInit()
  }

  //獲取合作案清單
  async getInit(){
    //call 智能合約中的cooperationCnt 來判斷當前合作案的數量
    let coolen=0;
    coolen = await platform.methods.cooperationCnt().call()
    for (var i = 0; i < coolen; i++) {
      //call 智能合約中的cooperations 來獲取該合作案
      const cooperation = await platform.methods.cooperations(i).call()
      //獲取該合作案的發起人
      const host = await platform.methods.members(cooperation.host).call()
      this.setState({
        cooperations: [...this.state.cooperations, [cooperation,host]]
      })
    }
  }

  //點選button: target 跳轉到CooperationInform的介面
  //param: 合作案的ID
  async handleCooperation(cooID) {
    let path = "/CooperationInform"; 
    history.push({
      pathname:path,
      state:{
        cooperationID:cooID
      }
    });
  }

  //點選button: join to share 跳轉到joinCooperation的介面
  //param: 合作案的ID  
  async handleJoin(cooID) {
    let path = "/JoinCooperation"; 
    history.push({
      pathname:path,
      state:{
        cooperationID:cooID
      }
    });
  }

  render() {
    return (
      <div>
        <Nbar account={this.state.account} manager ={this.state.manager}/>
        <h3>Account: {this.state.account}</h3>
        <br/>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Target</th>
              <th scope="col">Host</th>
              <th scope="col">Join</th>
            </tr>
          </thead>
          <tbody id="request">
            { this.state.cooperations.map((cooperation, key) => {
              let join
              join= <td>
                      <input
                        type="button"
                        value="Join to share"
                        style={{cursor:'pointer'}}
                        onClick={()=>this.handleJoin(cooperation[0].cooperationID)}
                      />
                    </td>
              return(
                <tr key={key}>
                  <th scope="row">{cooperation[0].cooperationID.toString()} </th>
                  <td>
                    <input
                      type = "button"
                      value={cooperation[0].target}
                      style={{cursor:'pointer'}}
                      onClick={()=>this.handleCooperation(cooperation[0].cooperationID)}
                    />
                  </td>
                  <td>{cooperation[1].orgnizationName}</td>
                  {join}
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


export default CooperationList;