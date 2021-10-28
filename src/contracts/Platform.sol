pragma solidity >=0.7.0 <0.9.0;

contract Platform {
    //計算資料要求的總數
    uint public requestCnt =0;
    
    //成員結構
    struct Mem{
        string name;
        string email;
        string phone;
        address addr;
    }
    
    //需求結構
    struct Request{
        uint ID;
        string column;
        int privacy;
        string discription;
        address ownerAddress;
    }
    
    //判斷是否為成員
    modifier memberOnly{
        require(memberCheck[msg.sender]==true);
        _;
    }
    
    //位址對應成員的map
    mapping (address => Mem) public members;
    
    //判斷該位址是否已成為成員
    mapping (address => bool) public memberCheck;

    //資料要求的ID
    mapping (uint => Request) public requestsID;
    
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
        Request memory req;
        requestCnt++;
        req=Request({
            ID: requestCnt,
            column:_column,
            privacy:_privacy,
            discription:_discription,
            ownerAddress:msg.sender
        });
        requestsID[req.ID] = req;
    }
    
    //取得需求
    function getMemberRequest(uint id) public view returns(string memory){
        return requestsID[id].discription;
    }
}

