import web3 from './web3';
import Platform from '../../abis/DSPF.json';

const platform =new web3.eth.Contract(
    Platform.abi,
    '0x41822Aa6331b0C8498D5056945D5FB78C03fdD1F'
);

export default platform;