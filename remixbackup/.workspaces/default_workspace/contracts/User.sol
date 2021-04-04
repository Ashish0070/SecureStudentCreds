// SPDX-License-Identifier: CC-BY-SA-4.0

pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

contract User {
    
    struct user{
        string name;
        string designation;
    }
    
    user[] users; //for storing all user structs
    mapping(address => bool) userExists;  //if for an address user exists;
    mapping(uint => address) addressOfUser; //id of user to address
    mapping(address => uint) userOfAddress; //address to id of user
    uint totalUsers=0; //total users
    uint totalSchools=0;

    function equalsString(string memory _first,string memory _second) internal pure returns (bool) {
        // Just compare the output of hashing all fields packed
        return(keccak256(abi.encodePacked(_first)) == keccak256(abi.encodePacked(_second)));
    }
    
    function hasUser(address _a) public view returns (bool) { 
        return userExists[_a];
    }
    
    
    function createUser(string memory name, string memory designation) external {
        
        //check if user from this address already exists
        require(!hasUser(msg.sender));
        
        //create a new user
        user memory u = user(name, designation);
        
        if(equalsString(designation, "School")){
            totalSchools++;
        }
        
        uint id = totalUsers;
        
        addressOfUser[id] = msg.sender;
        userOfAddress[msg.sender] = id;
        
        userExists[msg.sender] = true;
        
        users.push(u);
        
        totalUsers++;
    }
    
    
    function getUserAddress(string memory name, string memory designation) public view returns (address) {
        uint id = 0;
        for(;id<totalUsers;id++){
            if(equalsString(name, users[id].name) && equalsString(designation, users[id].designation)){
                break;
            }
        }
        
        return addressOfUser[id];
    }
    
    function getUser(address _a) public view returns (user memory) {
        return users[userOfAddress[_a]];
    }
    
}