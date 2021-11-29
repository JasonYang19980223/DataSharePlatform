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
        uint cooperationID;
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
        string resultDataset;
        address host;
        uint memCnt;
        mapping(uint => Mem) mems;
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
    mapping (uint => Dataset) public datasets;


    mapping (uint => ResultDataset) public results;
    
    
    mapping (uint => Cooperation) public cooperations;
    
    mapping (uint => string[]) public colByDataset;
    
    // mapping (uint => Mem[]) public cooperationMem;

    // mapping (uint => string[]) public cooperationFile;

    event createMemEvent(
        string orgnizationName,
        string email,
        string phone,
        address addr
    );
    
    event uploaDatesetEvent(
        uint _cooperationID,
        uint datasetID,
        string ipfsHash,
        address ownerAddress
    );
    
    event createCooperationEvent(
        uint cooperationID,
        string target,
        address ownerAddress,
        string hostName
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
    function uploadDataset(string memory _ipfsHash ,uint _privacy,uint _cooperationID) public memberOnly{
        Dataset memory dataset;
        datasetCnt++;
        
        dataset=Dataset({
            cooperationID:_cooperationID,
            datasetID : datasetCnt,
            ipfsHash : _ipfsHash,
            privacy:_privacy,
            getResult : false,
            ownerAddress :msg.sender
        });
        // addCooperationMem(_cooperationID, members[msg.sender]);
        // addCooperationFile(_cooperationID,dataset.ipfsHash);
        datasets[dataset.datasetID] = dataset;
        
        emit uploaDatesetEvent(
            _cooperationID,
            dataset.datasetID,
            _ipfsHash,
            msg.sender
        );
    }

    function addColumn(uint _datasetID,string memory _col) public {
        colByDataset[_datasetID].push(_col);
    }
    
    
    function createCooperation( string memory _target) public {
        cooperationCnt++;
        Cooperation storage coo = cooperations[cooperationCnt];
        //Initialize
        coo.cooperationID=cooperationCnt;
        coo.target=_target;
        coo.resultDataset='';
        coo.host=msg.sender;
        coo.memCnt=0;
        coo.mems[coo.memCnt]=members[msg.sender];

        emit createCooperationEvent(
            coo.cooperationID,
            coo.target,
            coo.host,
            coo.mems[coo.memCnt].orgnizationName
        );
    }

    function getCooMemName(uint _cooperationID,uint _memIdx) public view returns(string memory){
        Cooperation storage coo = cooperations[_cooperationID];
        return coo.mems[_memIdx].orgnizationName;
    }
    
    function getCooMemPhone(uint _cooperationID,uint _memIdx) public view returns(string memory){
        Cooperation storage coo = cooperations[_cooperationID];
        return coo.mems[_memIdx].phone;
    }

    function getCooMemEmail(uint _cooperationID,uint _memIdx) public view returns(string memory){
        Cooperation storage coo = cooperations[_cooperationID];
        return coo.mems[_memIdx].email;
    }

    function getCooMemAddr(uint _cooperationID,uint _memIdx) public view returns(address){
        Cooperation storage coo = cooperations[_cooperationID];
        return coo.mems[_memIdx].addr;
    }
    
    event addMem(
        uint memCnt,
        string memName
    );
    function addCooperationMem(uint _cooperationID) public {
        cooperations[_cooperationID].memCnt++;
        cooperations[_cooperationID].mems[cooperations[_cooperationID].memCnt]=members[msg.sender];
        emit addMem(
            cooperations[_cooperationID].memCnt,
            cooperations[_cooperationID].mems[cooperations[_cooperationID].memCnt].orgnizationName
        );
    }
    
    
    // function addCooperationFile(uint _cooperationID,string memory _ipfs) public {
    //     cooperationFile[_cooperationID].push(_ipfs);
    // }
    
    function uploadResultFile(uint _cooperationID ,string memory _ipfsHash) public managerOnly{
        ResultDataset memory RD;
        resultsetCnt++;
        RD=ResultDataset({
            resultID:resultsetCnt,
            cooperationID:_cooperationID,
            ipfsHashResult:_ipfsHash
        });
        results[RD.resultID]=RD;
        cooperations[_cooperationID].resultDataset=_ipfsHash;
        
        emit uploadResEvent(
            RD.resultID,
            _cooperationID,
            _ipfsHash
        );
    }

    
}

