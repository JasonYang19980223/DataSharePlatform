import Web3 from 'web3';

let web3;

async function loadWeb3(){
    if (window.ethereum) {
      web3 = new Web3(window.ethereum)
      await window.ethereum.request({ method: 'eth_requestAccounts' })
    }
    else if (window.web3) {
      web3 = new Web3(window.ethereum)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
}

loadWeb3();

export default web3;