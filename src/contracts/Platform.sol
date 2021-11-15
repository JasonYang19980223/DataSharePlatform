pragma solidity >=0.7.0 <0.9.0;

contract Platform {
    //平台管理者帳號
    address public manager;
    
    //計算資料要求的總數，當作資料要求的ID
    uint public datasetCnt =0;
    
    //計算資料分享的總數，當作資料分享的ID
    uint public sharesetCnt =0;
    
    //初始化平台管理者地址
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
    
    //資料表（需求/分享）的架構
    struct Dataset{
        uint ID;
        string ipfsHash;
        string ipfsHashShare;
        string ipfsHashResult;
        address ownerAddress;
    }

    //資料表（需求/分享）的描述
    struct DatasetInform{
        uint ID;
        string column;
        int privacyRequirement;
        string discription;
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

    //需求資料表結構的ID
    mapping (uint => Dataset) public requestsID;
    
    //資料表需求和描述的ID
    mapping (uint => DatasetInform) public reqInformID;

    //資料表需求和描述的ID->資料表分享和描述的ID
    mapping (uint => uint) public reqToSha;
    
    //分享資料表結構的ID
    mapping (uint => Dataset) public sharesID;
    
    //資料表分享和描述的ID
    mapping (uint => DatasetInform) public shaInformID;    
    
    //需求者對應address和ipfs的hash
    mapping (string => address) public ipfsOwner;

    event createMemEvent(
        string name,
        string email,
        string phone,
        address addr
    );
    
    event createReqEvent(
        string ipfsHash,
        address ownerAddress
    );
    
    event createShaEvent(
        string ipfsShareHash,
        address ownerAddress
    );
    
    event createResEvent(
        string ipfsResultHash,
        address ownerAddress
    );
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
        emit createMemEvent(
            _name,
            _email,
            _phone,
            msg.sender
        );
    }
      
    //新增需求
    function createRequest(string memory _ipfsHash ,string memory _column,int _privacy,string memory _discription) public memberOnly{
        Dataset memory res;
        DatasetInform memory reqInf;
        datasetCnt++;
        
        res=Dataset({
            ID: datasetCnt,
            ipfsHash:_ipfsHash,
            ipfsHashShare:'',
            ipfsHashResult:'',
            ownerAddress:msg.sender
        });
        
        reqInf=DatasetInform({
            ID:datasetCnt,
            column:_column,
            privacyRequirement:_privacy,
            discription:_discription,
            ownerAddress:msg.sender
        });
        requestsID[res.ID] = res;
        reqInformID[reqInf.ID]=reqInf;
        
        ipfsOwner[_ipfsHash] = msg.sender;
        
        emit createReqEvent(
            _ipfsHash,
            msg.sender
        );
    }
    
    //新增分享
    function createShare(uint reqid,string memory _ipfsHash ,string memory _column,int _privacy) public memberOnly{
        Dataset memory sha;
        DatasetInform memory shaInf;
        sharesetCnt++;
        
        sha=Dataset({
            ID: sharesetCnt,
            ipfsHash:_ipfsHash,
            ipfsHashShare:'',
            ipfsHashResult:'',
            ownerAddress:msg.sender
        });
        
        shaInf=DatasetInform({
            ID:sharesetCnt,
            column:_column,
            privacyRequirement:_privacy,
            discription:'share',
            ownerAddress:msg.sender
        });
        sharesID[sha.ID]=sha;
        shaInformID[shaInf.ID]=shaInf;
        
        ipfsOwner[_ipfsHash] = msg.sender;
        requestsID[reqid].ipfsHashShare=_ipfsHash;
        reqToSha[reqid]=sha.ID;
        emit createShaEvent(
            _ipfsHash,
            msg.sender
        );
    }    

    function uploadResultFile(uint id ,string memory _ipfsHash) public managerOnly{
        ipfsOwner[_ipfsHash] = msg.sender;
        requestsID[id].ipfsHashResult=_ipfsHash;
        
        emit createResEvent(
            _ipfsHash,
            msg.sender
        );
    }
}

