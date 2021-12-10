import web3 from './web3';
import Platform from '../../abis/DSPF.json';

const platform =new web3.eth.Contract(
    Platform.abi,
    '0x45fa283217AaE7Baf9c2b59238A358dDfb7aD306'
);

export default platform;