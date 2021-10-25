import React, { Component } from 'react';
import Nbar from './Nbar.js';
import Storage from '../abis/Storage.json'
import Web3 from 'web3'




class App extends Component {
  

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
    if(networkData) {
      const storage = new web3.eth.Contract(Storage.abi, networkData.address)
      this.setState({storage})
      console.log(Storage.abi, networkData.address)
      const s = await storage.methods.retrieve().call()
      console.log(s)
    } else {
      window.alert('contract not deployed to detected network.')
    }
  }

  constructor(props){
    super(props)
    this.state = {
      contract:'',
    }    
  }

  render() {
    return (
      <div className="Home">
        <Nbar/>
      </div>
    );
  }
}

export default App;