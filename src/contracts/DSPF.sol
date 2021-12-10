pragma solidity >=0.7.0 <0.9.0;
pragma experimental ABIEncoderV2;
contract DSPF {
    //平台管理者帳號
    address public manager;
    
    //計算資料申請的總數，當作資料要求的ID
    uint public datasetCnt =0;
    
    //計算資料申請的總數，當作資料要求的ID
    uint public cooperationCnt =0;
    
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
        uint cooCnt;
    }
    
    //資料欄位的架構
    struct Dataset{
        uint cooperationID;
        uint datasetID;
        string ipfsHash;
        address ownerAddress;
        uint colCnt;
    }

    //合作的架構
    struct Cooperation{
        uint cooperationID;
        string target;
        string miningFun;
        address host;
        uint memCnt;
        uint dataCnt;
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
    
    //位址對應成員
    mapping (address => Mem) public members;
    
    //判斷該位址是否已成為成員
    mapping (address => bool) public memberCheck;

    //資料表的ID
    mapping (uint => Dataset) public datasets;

    //資料表的欄位
    mapping (uint =>mapping (uint => string)) public datasetsCol;
    
    //合作的ID
    mapping (uint => Cooperation) public cooperations;

    //合作的成員
    mapping (uint =>mapping (uint => Mem)) public cooperationMems;
    
    //合作的資料欄位集
    mapping (uint =>mapping (address => Dataset)) public cooperationDatas;

    //成員參與的合作
    mapping (address => mapping (uint => Cooperation)) public memberCooperations;

    event createMemEvent(
        string orgnizationName,
        string email,
        string phone,
        address addr
    );
    
    event setDatesetEvent(
        uint _cooperationID,
        uint datasetID,
        address ownerAddress
    );
    
    event createCooperationEvent(
        uint cooperationID,
        string target,
        string miningFun,
        string hostName
    );

    event addMem(
        uint memCnt,
        string memName
    );

    event addData(
        uint datasetID,
        string col
    );

    event getData(
        string col
    );

    event setData(
        string col
    );
    
    //新增成員
    function createMember(string memory _orgnizationName, string memory _email, string memory _phone)public{
        //設定位址對應成員實體
        members[msg.sender] = Mem({
            orgnizationName: _orgnizationName,
            email: _email,
            phone:_phone,
            addr: msg.sender,
            cooCnt:0
        });

        //設定位址成為成員
        memberCheck[msg.sender]=true;
        
        //新增成員的log
        emit createMemEvent(
            _orgnizationName,
            _email,
            _phone,
            msg.sender
        );
    }
      
    //新增資料表
    function setDataset(uint _cooperationID) public memberOnly{
        datasets[datasetCnt]=Dataset({
            cooperationID:_cooperationID,
            datasetID:datasetCnt,
            ipfsHash:'',
            ownerAddress:msg.sender,
            colCnt:0
        });
        

        cooperationDatas[_cooperationID][msg.sender]=datasets[datasetCnt];
        cooperations[_cooperationID].dataCnt++;
        emit setDatesetEvent(
            datasets[datasetCnt].cooperationID,
            datasets[datasetCnt].datasetID,
            msg.sender
        );
        datasetCnt=datasetCnt+1;
    }

    function getColumn(uint _datasetID,uint _dataIdx) public view returns(string memory){
        return datasetsCol[_datasetID][_dataIdx];
    }

    function addColumn(uint _datasetID,string memory _col) public {
        datasetsCol[_datasetID][datasets[_datasetID].colCnt]=_col;
        datasets[_datasetID].colCnt++;
    }
    
    
    function createCooperation( string memory _target,string memory _miningFun) public memberOnly{
        cooperations[cooperationCnt] = Cooperation({
            cooperationID:cooperationCnt,
            target:_target,
            host:msg.sender,
            memCnt : 0,
            dataCnt : 0,
            miningFun : _miningFun,
            getResult:false
        });
        memberCooperations[msg.sender][members[msg.sender].cooCnt]=cooperations[cooperationCnt];
        members[msg.sender].cooCnt++;
        cooperationMems[cooperationCnt][0] = members[msg.sender];
        cooperations[cooperationCnt].memCnt++;
        
        emit createCooperationEvent(
            cooperations[cooperationCnt].cooperationID,
            cooperations[cooperationCnt].target,
            cooperations[cooperationCnt].miningFun,
            cooperationMems[cooperationCnt][0].orgnizationName
        );
        cooperationCnt=cooperationCnt+1;
    }

    function getCooMemName(uint _cooperationID,uint _memIdx) public view returns(string memory){
        return cooperationMems[_cooperationID][_memIdx].orgnizationName;
    }
    
    function getCooMemPhone(uint _cooperationID,uint _memIdx) public view returns(string memory){
        return cooperationMems[_cooperationID][_memIdx].phone;
    }

    function getCooMemEmail(uint _cooperationID,uint _memIdx) public view returns(string memory){
        return cooperationMems[_cooperationID][_memIdx].email;
    }

    function getCooMemAddr(uint _cooperationID,uint _memIdx) public view returns(address){
        return cooperationMems[_cooperationID][_memIdx].addr;
    }

    function addCooperationMem(uint _cooperationID) public {
        cooperationMems[_cooperationID][cooperations[_cooperationID].memCnt]=members[msg.sender];
        memberCooperations[msg.sender][members[msg.sender].cooCnt]=cooperations[_cooperationID];
        members[msg.sender].cooCnt++;
        emit addMem(
            cooperations[_cooperationID].memCnt,
            cooperationMems[_cooperationID][cooperations[_cooperationID].memCnt].orgnizationName
        );
        cooperations[_cooperationID].memCnt++;
    }

    function getDataset(uint _cooperationID,address owner) public view returns(Dataset memory){
        return datasets[cooperationDatas[_cooperationID][owner].datasetID];
    }

    function getCooperation(address owner,uint idx) public view returns(Cooperation memory){
        return memberCooperations[owner][idx];
    }
    
}

