pragma solidity ^0.5.0;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 */
contract Member {
    constructor() public{
    }
    
    struct Mem{
        string name;
        string email;
        int gender; // 0= male 1= female
        int age; 
        address addr;
    }
    
    struct Request{
        string column;
        int privacy;
        string target;
    }

    modifier memberOnly{
        require(memberCheck[msg.sender]==true);
        _;
    }
    
    mapping (address => Mem) public members;
    mapping (address => bool) public memberCheck;

    mapping (address => Request) public requests;
    
    function createMember(string memory _name, string memory _email,int _gender, int _age)public {
        Mem memory m;
        m = Mem({
            name: _name,
            email: _email,
            gender: _gender,
            age: _age,
            addr: msg.sender
        });
        members[msg.sender] = m;
        memberCheck[msg.sender]=true;
    }
    
    function getMemberName() public view returns(string memory){
        return members[msg.sender].name;
    }
    
    function createRequest(string memory _column,int _privacy,string memory _target) public memberOnly{
        Request memory r;
        r=Request({
            column:_column,
            privacy:_privacy,
            target:_target
        });
        requests[msg.sender] = r;
    }
    
    function getMemberRequest() public view returns(string memory){
        return requests[msg.sender].target;
    }
}

