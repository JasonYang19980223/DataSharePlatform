import web3 from './web3';
import Platform from '../../abis/DSPF.json';

const platform =new web3.eth.Contract(
    Platform.abi,
    '0x3C9ec467ea979649609819628DFba0320e8bd577'
);

export default platform;