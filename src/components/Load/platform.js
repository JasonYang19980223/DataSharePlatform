import web3 from './web3';
import Platform from '../../abis/DSPF.json';

const platform =new web3.eth.Contract(
    Platform.abi,
    '0x5EF8Fc89EcfeADAabAb54B2f42383FAa0664121a'
);

export default platform;