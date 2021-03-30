// SPDX-License-Identifier: CC-BY-SA-4.0

pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;


//Stores all files owned by a particular student

contract FileContract {
   
    struct File {
        bytes ipfsHash;
        string title;
        string description;
        address owner;
    }
    
    File[] ownerToFiles;
    uint curr = 0;
    
    function uploadFile(bytes memory ipfsHash, string memory title, string memory description) public {
        //upload a file
        File memory newFile;
        newFile.ipfsHash = ipfsHash;
        newFile.title = title;
        newFile.description = description;
        newFile.owner = msg.sender;
        
        ownerToFiles[curr] = newFile;
        curr++;
    }
    
    function getFileCount() public view returns (uint) {
        //get file count
        return curr;
    } 
    
    function getFile() public view returns (File[] memory) {
        // for(uint i=0;i<curr;i++){
        //     if(ownerToFiles[i].owner == msg.sender){
        //         return ownerToFiles[i];
        //     }
        // }
        
        // File memory emptyFile;
        // return emptyFile;
        
        //return all files 
        return ownerToFiles;
    }
    
    
    
}