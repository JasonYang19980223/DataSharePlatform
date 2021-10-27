import web3 from '../web3';
import Member from '../../abis/Member.json';


const member = new web3.eth.Contract(
    Member.abi,
    '0x28bE321a2205309766756a54798De214d4adAFCC'
);

export default member;