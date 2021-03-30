// SPDX-License-Identifier: CC-BY-SA-4.0

pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

contract User {
    
    struct user{
        string name;
        string designation;
    }
    
    user[] public addressToUser; //for storing all user structs
    mapping(address => bool) public userExists;  //if for an address user exists;
    mapping(uint => address) public addressOfUser; //id of user to address
    mapping(address => uint) userOfAddress; //address to id of user
    uint totalUsers; //total users
    
    //comparing structs
    function equals(user memory _first,user memory _second) internal pure returns (bool) {
        // Just compare the output of hashing all fields packed
        return(keccak256(abi.encodePacked(_first.name, _first.designation)) == keccak256(abi.encodePacked(_second.name, _second.designation)));
    }

    
    function hasUser() public view returns (bool) { 
        return userExists[msg.sender];
    }
    
    
    function createUser(string memory name, string memory designation) public {
        
        //check if user from this address already exists
        require(userExists[msg.sender]);
        
        //create a new user
        user memory u = user(name, designation);
        
        
        uint id = totalUsers;
        addressOfUser[id] = msg.sender;
        
        userExists[msg.sender] = true;
        
        addressToUser[id] = u;
        
        userOfAddress[msg.sender] = id;
        
        totalUsers++;
    }
    
    
    function getUserAddress(user memory u) public view returns (address) {
        uint id = 0;
        for(;id<totalUsers;id++){
            if(equals(u, addressToUser[id])){
                break;
            }
        }
        
        return addressOfUser[id];
    }
    
    function getUser() public view returns (user memory) {
        return addressToUser[userOfAddress[msg.sender]];
    }
    
    
}