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
      cols:[]
    }
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
    console.log(this.props.location.state.cooperationID)
    console.log(this.props.location.state.memberAddress)
    const dataset =  await platform.methods.getDataset(this.props.location.state.cooperationID,this.props.location.state.memberAddress).call()
    for (let i = 0; i < dataset.colCnt; i++) {
      let col = await platform.methods.getColumn(dataset.datasetID,i).call()
      console.log(col)
      this.setState({
        cols: [...this.state.cols, col]
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

  render() {
    return (
      <div>
        <Nbar account={this.state.account} manager ={this.state.manager}/>
        <h3>Account: {this.state.account}</h3>
        <br/>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Column</th>
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