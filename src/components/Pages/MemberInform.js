import React, { Component } from 'react';
import web3 from '../Load/web3.js'
import Nbar from '../Nbar.js';
import platform from '../Load/platform.js'

class MemberInform extends Component {
  
  constructor(props){
    super(props)
    this.state = {
      account:'',
      name:'',
      phone:'',
      email:'',
      datasets:[],
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
      let dataset = await platform.methods.datasets(i).call()
      let address = dataset.ownerAddress
      if(address===this.state.account){
        if(dataset.ipfsHashResult==='') dataset.ipfsHashResult="waiting"
        console.log('a')
        console.log(dataset)
        this.setState({
          datasets: [...this.state.datasets, dataset]
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
              <th scope="col">data</th>
              <th scope="col">privacy</th>
              <th scope="col">result</th>
            </tr>
          </thead>
          <tbody id="request">
            { this.state.datasets.map((dataset, key) => {
              return(
                <tr key={key}>
                  <th scope="row">{dataset.datasetID.toString()} </th>
                  <td>dataset name</td>
                  <td>{dataset.privacy.toString()}</td>
                  <td>{dataset.ipfsHash}</td>
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