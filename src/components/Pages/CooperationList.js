import React, { Component } from 'react';
import web3 from '../Load/web3.js'
import Nbar from '../Nbar.js';
import platform from '../Load/platform.js'
import history from '../../History';

class RequestList extends Component {
  
  constructor(props){
    super(props)
    this.state = {
      account: '',
      cooperations:[],
      requests:[],
      isLogIn:''
    }
    this.handleCooperation= this.handleCooperation.bind(this);
    this.handleJoin= this.handleJoin.bind(this);
  }

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

  async getInit(){
    let coolen=0;
    coolen = await platform.methods.cooperationCnt().call()
    console.log(coolen)
    for (var i = 0; i < coolen; i++) {
      const cooperation = await platform.methods.cooperations(i).call()
      const host = await platform.methods.members(cooperation.host).call()
      this.setState({
        cooperations: [...this.state.cooperations, [cooperation,host]]
      })
    }
  }

  async handleCooperation(cooID) {
    let path = "/CooperationInform"; 
    history.push({
      pathname:path,
      state:{
        cooperationID:cooID
      }
    });
  }

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


export default RequestList;