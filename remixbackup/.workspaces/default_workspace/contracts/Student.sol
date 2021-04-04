// SPDX-License-Identifier: CC-BY-SA-4.0

pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;
import './User.sol';
import './FileContract.sol';

contract Student is User{
    
    FileContract fc;  //all files owned by a student
    address FileContractAddress = 0xb9d76A0C78338f6622a2364afeC9e60CCB8e7B35;  //set it later(deployed one)
    
    constructor() public {
        //create an instance of File Contract using the deployed File Contract's address
        fc = FileContract(FileContractAddress);
    }
    
    //get your number of files
    function getFileCount() public view returns (uint) {
        // return no of files owned by this student
        return fc.getFileCount(msg.sender);
    }
    
    //get your files
    function getFile() public view returns (FileContract.File[] memory) {
        // return all files owned by this student
        return fc.getFile(msg.sender);
    }
    
}