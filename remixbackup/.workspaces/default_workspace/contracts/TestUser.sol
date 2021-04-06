// SPDX-License-Identifier: CC-BY-SA-4.0

pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

contract TestUser {
    
    struct user{
        string name;
        string designation;
    }
    
    user[] public users; //for storing all user structs
    //mapping(address => bool) public userExists;  //if for an address user exists;
    address[] public addressOfUser; //id of user to address
    mapping(address => uint) public userOfAddress; //address to id of user
    uint public totalUsers; //total users

    
    function equalsString(string memory _first,string memory _second) public pure returns (bool) {
        // Just compare the output of hashing all fields packed
        return keccak256(abi.encodePacked(_first)) == keccak256(abi.encodePacked(_second));
    }
    
    
    function hasUser(address _a) public view returns (bool) { 
        for(uint i=0;i<this.totalUsers();i++)
            if(this.addressOfUser(i)==_a)
                return true;
        
        return false;
    }
    
    
    function createUser(string memory name, string memory designation) public {
        
        //check if user from this address already exists
        require(!hasUser(msg.sender));
        
        //create a new user
        users.push(user(name, designation));
        addressOfUser.push(msg.sender);
        
        //userOfAddress[msg.sender] = totalUsers;
        
        //userExists[msg.sender] = true;
        
        totalUsers++;
    }
    
    
    function getUserAddress(string memory name, string memory designation) public view returns (address) {
        for(uint i=0;i<totalUsers;i++)
            if(equalsString(name, users[i].name) && equalsString(designation, users[i].designation))
                return this.addressOfUser(i);
    }
    
    
    function getUser(address _a) public view returns (user memory) {
        for(uint i=0;i<totalUsers;i++)
            if(this.addressOfUser(i)==_a)
                return users[i];
    }
    
}