import web3 from './web3';
import Platform from '../../abis/Platform.json';

// let platform

// async function loadAddress(){
//     const networkID = await web3.eth.net.getId()
//     const networkData = Platform.networks[networkID]
//     console.log(networkID)
//     const address = networkData.address
//     console.log(address)
//     platform = new web3.eth.Contract(
//         Platform.abi,
//         address
//     );
//     console.log(platform)
// }


// (async () => {
//   await loadAddress()
// })()

// console.log(platform)
// export default platform;





const platform =new web3.eth.Contract(
    Platform.abi,
    '0x27c2F71BB13A059aDf2fe757a349a4801109277B'
);

export default platform;