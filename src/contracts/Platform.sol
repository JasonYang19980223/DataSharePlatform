pragma solidity >=0.7.0 <0.9.0;

contract Platform {
    //平台管理者帳號
    address public manager;
    //計算資料要求的總數
    uint public datasetCnt =0;
    
    //初始化平台管理者
    constructor(){
        manager = msg.sender;
    }
    
    //成員架構
    struct Mem{
        string name;
        string email;
        string phone;
        address addr;
    }
    
    //資料表架構
    struct Dataset{
        uint ID;
        string column;
        int privacyRequirement;
        string discription;
        string ipfsHash;
        string ipfsHashShare;
        string ipfsHashResult;
        address ownerAddress;
    }
    

    //判斷是否為成員
    modifier memberOnly{
        require(memberCheck[msg.sender]==true);
        _;
    }

    //判斷是否為管理員
    modifier managerOnly{
        require(msg.sender==manager);
        _;
    }
    
    //位址對應成員的map
    mapping (address => Mem) public members;
    
    //判斷該位址是否已成為成員
    mapping (address => bool) public memberCheck;

    //資料要求的ID
    mapping (uint => Dataset) public requestsID;
    
    //需求者對應address和ipfs的hash
    mapping (string => address) public ipfsOwner;


    //新增成員
    function createMember(string memory _name, string memory _email, string memory _phone)public{
        Mem memory m;
        m = Mem({
            name: _name,
            email: _email,
            phone:_phone,
            addr: msg.sender
        });
        members[msg.sender] = m;
        memberCheck[msg.sender]=true;
    }
    
    //取得成員的名稱
    function getMemberName() public view returns(string memory){
        return members[msg.sender].name;
    }

    
    //新增需求
    function createRequest(string memory _ipfsHash ,string memory _column,int _privacy,string memory _discription) public memberOnly{
        Dataset memory res;
        datasetCnt++;
        res=Dataset({
            ID: datasetCnt,
            column:_column,
            privacyRequirement:_privacy,
            discription:_discription,
            ipfsHash:_ipfsHash,
            ipfsHashShare:'',
            ipfsHashResult:'',
            ownerAddress:msg.sender
        });
        ipfsOwner[_ipfsHash] = msg.sender;
        requestsID[res.ID] = res;
    }
    
    //新增分享
    function createShare(uint reqid,string memory _ipfsHash ,string memory _column,int _privacy) public memberOnly{
        Dataset memory res;
        res=Dataset({
            ID: 0,
            column:_column,
            privacyRequirement:_privacy,
            discription:'share',
            ipfsHash:_ipfsHash,
            ipfsHashShare:'',
            ipfsHashResult:'',
            ownerAddress:msg.sender
        });
        ipfsOwner[_ipfsHash] = msg.sender;
        requestsID[reqid].ipfsHashShare=_ipfsHash;
    }    

    //上傳ipfs檔案
    // function uploadRequestFile(uint id, string memory _ipfsHash) public memberOnly{
    //     requestsID[id].ipfsHash=_ipfsHash;
    //     ipfsOwner[_ipfsHash] = msg.sender;
    // }
    
    // function uploadShareFile(uint id ,string memory _ipfsHash) public memberOnly{
    //     ipfsOwner[_ipfsHash] = msg.sender;
    //     requestsID[id].ipfsHashShare=_ipfsHash;
    // }

    function uploadResultFile(uint id ,string memory _ipfsHash) public managerOnly{
        ipfsOwner[_ipfsHash] = msg.sender;
        requestsID[id].ipfsHashResult=_ipfsHash;
    }
}

