import React, { Component } from 'react';
import Storage from '../abis/Storage.json'
import Web3 from 'web3'
import Nbar from './Nbar.js';


class Create extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  //檢查有沒有裝MetaMask
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.request({ method: 'eth_requestAccounts' })
    }
    else if (window.web3) {
      window.web3 = new Web3(window.ethereum)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Storage.networks[networkId]
    console.log(networkData.address)
    if(networkData) {
      const storage =new web3.eth.Contract(Storage.abi, networkData.address)
      this.setState({storage})
    } else {
      window.alert('Marketplace contract not deployed to detected network.')
    }
  }

  constructor(props){
    super(props)
    this.state = {
      account: '',
      num:5,
      submitNum:0
    }    
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(e) {
    this.setState({num: e.target.value});
  }

  async handleClick(e) {
    this.setState({submitNum:this.state.num})
    await this.state.storage.methods.store(parseInt(this.state.submitNum)).send({ from: this.state.account })
    console.log(this.state.submitNum);
  }

  render() {
    return (
      <div>
        <Nbar account={this.state.account}/>
        <h1>
          create member
        </h1>
        <div>
          <input type="text" onChange={ this.handleChange } />
          <input
            type="button"
            value="store num"
            onClick={this.handleClick}
          />
        </div>
        <h3>storage: {this.state.submitNum}</h3>
      </div>
    );
  }
}


export default Create;