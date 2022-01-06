import React, { Component } from 'react';
import web3 from '../Load/web3.js'
import Nbar from '../Nbar.js';
import platform from '../Load/platform.js'


//********該成員提供什麼欄位的介面***********
class RequestList extends Component {
  
  //account 使用者的地址
  //cols 該成員提供的欄位
  constructor(props){
    super(props)
    this.state = {
      account: '',
      cols:[]
    }
  }

  //進入頁面前先進行初始化，設定使用者地址，並確認是否為管理者 
  //call getInit() 來獲取該成員提供的欄位  
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

  //call 智能合約中的getDataset
  //param: 合作案ID => this.props.location.state.cooperationID(從 CooperationInform 獲取的合作案ID)  .
  //param: 該成員位址 => this.props.location.state.memberAddress(從 CooperationInform 獲取的成員地址)  
  async getInit(){
    const dataset =  await platform.methods.getDataset(this.props.location.state.cooperationID,this.props.location.state.memberAddress).call()
    for (let i = 0; i < dataset.colCnt; i++) {
      let col = await platform.methods.getColumn(dataset.datasetID,i).call()
      this.setState({
        cols: [...this.state.cols, col]
      })
    }
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
              <th scope="col">Columns</th>
            </tr>
          </thead>
          <tbody id="request">
            { this.state.cols.map((col, key) => {
              return(
                <tr key={key}>
                  <td>{col}</td>
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


export default RequestList;