import React, { Component } from 'react';
import web3 from './web3.js'
import Nbar from './Nbar.js';
import platform from './contract/platform.js'
import history from '../History';

class RequestList extends Component {
  
  constructor(props){
    super(props)
    this.state = {
      account: '',
      requests:[],
      isLogIn:''
    }
    this.handleClick = this.handleClick.bind(this);
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
    let reqLen=0;
    console.log(reqLen)
    reqLen = await platform.methods.datasetCnt().call()
    console.log(reqLen)

    for (var i = 1; i <= reqLen; i++) {
      const request = await platform.methods.requestsID(i).call()
      this.setState({
        requests: [...this.state.requests, request]
      })
    }
  }

  async handleClick(reqID) {
    let path = "/UploadShare"; 
    history.push({
      pathname:path,
      state:{
        requestID:reqID
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
              <th scope="col">account</th>
              <th scope="col">column</th>
              <th scope="col">privacy</th>
              <th scope="col">share</th>
            </tr>
          </thead>
          <tbody id="request">
            { this.state.requests.map((request, key) => {
              return(
                <tr key={key}>
                  <th scope="row">{request.ID.toString()} </th>
                  <td>{request.ownerAddress}</td>
                  <td>{request.column}</td>
                  <td>{request.privacyRequirement.toString()}</td>
                  <td>
                    <input
                      type="button"
                      value="Data Share"
                      style={{cursor:'pointer'}}
                      onClick={()=>this.handleClick(request.ID)}
                    />
                  </td>
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