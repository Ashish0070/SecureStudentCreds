// SPDX-License-Identifier: CC-BY-SA-4.0

pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

//Stores all files 

contract FileContract {
   
    struct File {
        string ipfsHash;
        string title;
        string description;
    }
    
    File[] public files;
    address[] public ownerOfFiles;
    mapping(address => uint) public fileCount;
    uint public curr;
    
    
    function uploadFile(string memory ipfsHash, string memory title, string memory description, address _owner) public {
        files.push(File(ipfsHash, title, description));
        ownerOfFiles.push(_owner);
        fileCount[_owner]++;
        curr++;
    }
    
    
    function getFileCount(address _owner) public view returns (uint) {
        return fileCount[_owner];
    } 
    
    
    function getFile(address _owner) public view returns (File[] memory) {
        File[] memory result = new File[](fileCount[_owner]);
        uint id=0;
        for(uint i=0;i<curr;i++){
            if(ownerOfFiles[i]==_owner){
                result[id] = files[i];
                id++;
            }
        }
        return result;
    }
    
}