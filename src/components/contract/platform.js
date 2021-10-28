import web3 from '../web3';
import Platform from '../../abis/Platform.json';


const platform = new web3.eth.Contract(
    Platform.abi,
    '0x747eD75ADDc8D8D6B12d153319eFe6e3AFA0cd33'
);

export default platform;