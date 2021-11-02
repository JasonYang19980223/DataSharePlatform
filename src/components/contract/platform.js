import web3 from '../web3';
import Platform from '../../abis/Platform.json';


const platform = new web3.eth.Contract(
    Platform.abi,
    '0x593597d8a04Cf76Ab90C2b742DD17204Bad7199c'
);

export default platform;