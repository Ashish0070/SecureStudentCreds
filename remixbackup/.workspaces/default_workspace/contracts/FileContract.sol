// SPDX-License-Identifier: CC-BY-SA-4.0

pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;


//Stores all files owned by a particular student

contract FileContract {
   
    struct File {
        bytes ipfsHash;
        string title;
        string description;
    }
    
    File[] public ownerToFiles;
    mapping(address => uint) public filesUnderOwner;
    mapping(uint => address) public ownerOfFiles;
    mapping(address => uint) public fileCount;
    uint curr;
    
    function uploadFile(bytes memory ipfsHash, string memory title, string memory description) public {
        //upload a file
        File memory newFile;
        newFile = File(ipfsHash, title, description);
        
        ownerToFiles[curr] = newFile;
        filesUnderOwner[msg.sender] = curr;
        ownerOfFiles[curr] = msg.sender;
        fileCount[msg.sender]++;
        
        curr++;
    }
    
    function getFileCount() public view returns (uint) {
        //get file count
        return fileCount[msg.sender];
    } 
    
    function getFile() public view returns (File memory) {
        uint id = filesUnderOwner[msg.sender];
        return ownerToFiles[id];
    }
    
}