pragma solidity >=0.7.0 <0.9.0;
pragma experimental ABIEncoderV2;
contract DSPF {
    //平台管理者帳號
    address public manager;
    
    //計算資料申請的總數，當作資料要求的ID
    uint public datasetCnt =0;
    
    //計算資料申請的總數，當作資料要求的ID
    uint public cooperationCnt =0;
    
    //計算資料結果的總數，當作資料結果的ID
    uint public resultsetCnt =0;
    
    //初始化平台管理者地址
    constructor(){
        manager = msg.sender;
    }
    
    //成員架構
    struct Mem{
        string orgnizationName;
        string email;
        string phone;
        address addr;
    }
    
    //資料表的架構
    struct Dataset{
        uint datasetID;
        uint privacy;
        string ipfsHash;
        bool getResult;
        address ownerAddress;
    }

    //分享
    struct Cooperation{
        uint cooperationID;
        string target;
        bool getResult;
        string resultDataset;
        address host;
    }

    
    struct ResultDataset{
        uint resultID;
        uint cooperationID;
        string ipfsHashResult;
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

    //資料表的ID
    mapping (uint => Dataset) public datasetID;


    mapping (uint => ResultDataset) public resID;
    
    
    mapping (uint => Cooperation) public cooperationID;
    
    mapping (uint => string[]) public colByDataset;
    
    mapping (uint => Mem[]) public cooperationMem;

    mapping (uint => string[]) public cooperationFile;

    event createMemEvent(
        string orgnizationName,
        string email,
        string phone,
        address addr
    );
    
    event uploaDatesetEvent(
        uint datasetID,
        string ipfsHash,
        address ownerAddress
    );
    
    event uploadResEvent(
        uint resultID,
        uint cooperationID,
        string ipfsHashResult
    );
    
    //新增成員
    function createMember(string memory _orgnizationName, string memory _email, string memory _phone)public{
        Mem memory m;
        m = Mem({
            orgnizationName: _orgnizationName,
            email: _email,
            phone:_phone,
            addr: msg.sender
        });
        members[msg.sender] = m;
        memberCheck[msg.sender]=true;
        emit createMemEvent(
            _orgnizationName,
            _email,
            _phone,
            msg.sender
        );
    }
      
    //新增資料表
    function uploadDataset(string memory _ipfsHash ,uint _privacy) public memberOnly{
        Dataset memory dataset;
        datasetCnt++;
        
        dataset=Dataset({
            datasetID : datasetCnt,
            ipfsHash : _ipfsHash,
            privacy:_privacy,
            getResult : false,
            ownerAddress :msg.sender
        });
        
        datasetID[dataset.datasetID] = dataset;
        
        emit uploaDatesetEvent(
            dataset.datasetID,
            _ipfsHash,
            msg.sender
        );
    }

    function addColumn(uint _datasetID,string memory _col) public {
        colByDataset[_datasetID].push(_col);
    }
    
    
    function createCooperation( string memory _target) public{
        Cooperation memory coo ;
        cooperationCnt++;
        
        coo=Cooperation({
            cooperationID:cooperationCnt,
            target:_target,
            getResult:false,
            resultDataset:'',
            host:msg.sender
        });
        cooperationID[coo.cooperationID]=coo;
    }
    
    
    function addCooperationMem(uint _cooperationID,Mem memory _mem) public {
        cooperationMem[_cooperationID].push(_mem);
    }
    
    
    function addCooperationFile(uint _cooperationID,string memory _ipfs) public {
        cooperationFile[_cooperationID].push(_ipfs);
    }
    
    function uploadResultFile(uint _cooperationID ,string memory _ipfsHash) public managerOnly{
        ResultDataset memory RD;
        resultsetCnt++;
        RD=ResultDataset({
            resultID:resultsetCnt,
            cooperationID:_cooperationID,
            ipfsHashResult:_ipfsHash
        });
        resID[RD.resultID]=RD;
        cooperationID[_cooperationID].getResult=true;
        
        emit uploadResEvent(
            RD.resultID,
            _cooperationID,
            _ipfsHash
        );
    }

    
}

