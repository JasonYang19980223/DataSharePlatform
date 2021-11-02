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
        uint dataType; //request:0 share:1 result:2
        string column;
        int privacyRequirement;
        string discription;
        address ownerAddress;
        string ipfsHash;
        bool getShare;
        bool getResult;
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
    function createRequest(string memory _column,int _privacy,string memory _discription) public memberOnly{
        Dataset memory res;
        datasetCnt++;
        res=Dataset({
            ID: datasetCnt,
            dataType:0,
            column:_column,
            privacyRequirement:_privacy,
            discription:_discription,
            ownerAddress:msg.sender,
            ipfsHash:'',
            getShare:false,
            getResult:false
        });
        requestsID[res.ID] = res;
    }
    
    //新增分享
    function createShare(string memory _column,int _privacy) public memberOnly{
        Dataset memory res;
        datasetCnt++;
        res=Dataset({
            ID: datasetCnt,
            dataType:1,
            column:_column,
            privacyRequirement:_privacy,
            discription:'share',
            ownerAddress:msg.sender,
            ipfsHash:'',
            getShare:false,
            getResult:false
        });
        requestsID[res.ID] = res;
    }    

    //上傳ipfs檔案
    function uploadRequestFile(string memory _ipfsHash) public memberOnly{
        string memory ipfsHash;
        ipfsHash = _ipfsHash;
        ipfsOwner[ipfsHash] = msg.sender;
    }
    
    function uploadShareFile(uint id ,string memory _ipfsHash) public memberOnly{
        string memory ipfsHash;
        ipfsHash = _ipfsHash;
        ipfsOwner[ipfsHash] = msg.sender;
        requestsID[id].getShare=true;
    }

    function uploadResultFile(uint id ,string memory _ipfsHash) public managerOnly{
        string memory ipfsHash;
        ipfsHash = _ipfsHash;
        ipfsOwner[ipfsHash] = msg.sender;
        requestsID[id].getResult=true;
    }
}

