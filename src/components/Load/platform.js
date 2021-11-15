import web3 from './web3';
import Platform from '../../abis/Platform.json';

const platform =new web3.eth.Contract(
    Platform.abi,
    '0xFa1000CF6664515B5BeBeF5664cEAD0eF2dB694A'
);

export default platform;