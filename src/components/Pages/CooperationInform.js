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
      mems:[],
      files:[],
      isLogIn:''
    }
    this.handleCol= this.handleCol.bind(this);
    this.getInit= this.getInit.bind(this);
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
    let cooperation = await platform.methods.cooperations(this.props.location.state.cooperationID).call()
    let memLen = cooperation.memCnt
    console.log(memLen)
    for (var i = 0; i < memLen; i++) {
      let memName =await platform.methods.getCooMemName(this.props.location.state.cooperationID,i).call()
      let memPhone =await platform.methods.getCooMemPhone(this.props.location.state.cooperationID,i).call()
      let memEmail =await platform.methods.getCooMemEmail(this.props.location.state.cooperationID,i).call()
      let memAddr =await platform.methods.getCooMemAddr(this.props.location.state.cooperationID,i).call()
      this.setState({
        mems: [...this.state.mems, [memName,memPhone,memEmail,memAddr]]
      })
    }
  }

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
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Phone</th>
              <th scope="col">Email</th>
              <th scope="col">Addr</th>
              <th scope="col">Member Columns</th>
            </tr>
          </thead>
          <tbody id="request">
            { this.state.mems.map((mem, key) => {
            //   let join
            //   join= <td>
            //           <input
            //             type="button"
            //             value="Join to share"
            //             style={{cursor:'pointer'}}
            //             onClick={()=>this.handleJoin(cooperation[0].cooperationID)}
            //           />
            //         </td>
              return(
                <tr key={key}>
                  <td>{mem[0]}</td>
                  {/* <td>
                    <input
                      type = "button"
                      value={dataset.ipfsHash}
                      style={{cursor:'pointer'}}
                      onClick={()=>this.handleCooperation(dataset.datasetID)}
                    />
                  </td> */}
                  <td>{mem[1]}</td>
                  <td>{mem[2]}</td>
                  <td>{mem[3]}</td>
                  <td>                    
                    <input 
                      type = "button"
                      value="col"
                      style={{cursor:'pointer'}}
                      onClick={()=>this.handleCol(this.props.location.state.cooperationID,mem[3])}
                    />
                  </td>
                  {/* <td>{cooperation.column}</td>
                  <td>{cooperation.privacyRequirement.toString()}</td>
                  {share} */}
                  {/* {join} */}
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