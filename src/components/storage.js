import web3 from './web3';
import Storage from '../abis/Storage.json';

/*let storage

async function loadBlockchainData() {
    // Load account
    const accounts = await web3.eth.getAccounts()
    const networkId = await web3.eth.net.getId()
    const networkData = Storage.networks[networkId]
    console.log(networkData.address)
    if(networkData) {
        storage =new web3.eth.Contract(Storage.abi, networkData.address)
        console.log("hello")
    } else {
      window.alert('Marketplace contract not deployed to detected network.')
    }
}

loadBlockchainData();

export default storage;*/

const instance = new web3.eth.Contract(
    Storage.abi,
    '0x330e17301B615caEA531bA0Eb69E67a20cF28657'
);

export default instance;