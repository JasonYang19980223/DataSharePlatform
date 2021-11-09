import React, { Component } from 'react';
import web3 from '../Load/web3.js'
import Nbar from '../Nbar.js';
import platform from '../Load/platform.js'

class MemberInform extends Component {
  
  constructor(props){
    super(props)
    this.state = {
      account: '',
      name:'',
      phone:'',
      email:'',
      requests:[],
      isLogIn:''
    }
  }

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

  async check(){
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    this.setState({isLogIn: await platform.methods.memberCheck(this.state.account).call()})
  }

  async getInit(){
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    let m =await platform.methods.members(this.state.account).call()
    this.setState({ name: m.name })


    let reqLen=0;
    reqLen = await platform.methods.datasetCnt().call()
    console.log(reqLen)

    for (var i = 1; i <= reqLen; i++) {
      let request = await platform.methods.requestsID(i).call()
      let reqInf = await platform.methods.reqInformID(i).call()
      let address = request.ownerAddress
      if(address===this.state.account){
        console.log('a')
        console.log(request)
        this.setState({
          requests: [...this.state.requests, [request,reqInf]]
        })
      }
    }
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
              <th scope="col">column</th>
              <th scope="col">privacy</th>
              <th scope="col">result</th>
            </tr>
          </thead>
          <tbody id="request">
            { this.state.requests.map((request, key) => {
              return(
                <tr key={key}>
                  <th scope="row">{request[0].ID.toString()} </th>
                  <td>{request[1].column}</td>
                  <td>{request[1].privacyRequirement.toString()}</td>
                  <td>{request[0].ipfsHashResult}</td>
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