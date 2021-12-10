import React, { Component } from 'react';
import web3 from '../Load/web3.js'
import Nbar from '../Nbar.js';
import platform from '../Load/platform.js'
import history from '../../History';

class MemberInform extends Component {
  
  constructor(props){
    super(props)
    this.state = {
      account:'',
      name:'',
      phone:'',
      email:'',
      cooperations:[],
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
    console.log(m.cooCnt)
    for(let i = 0;i<m.cooCnt;i++){
      let coo = await platform.methods.getCooperation(this.state.account,i).call()
      this.setState({
        cooperations: [...this.state.cooperations,coo]
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