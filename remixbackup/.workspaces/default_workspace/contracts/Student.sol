// SPDX-License-Identifier: CC-BY-SA-4.0

pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;
import './FileContract.sol';
import  './TestUser.sol';

contract Student is TestUser{
    
    FileContract public fc;  //all files owned by a student
    address public FileContractAddress = 0x2B382c265570168FE9F2a227C8B9B0B8c4E5FDA8;  //set it later(deployed one)
    
    constructor() public {
        //create an instance of File Contract using the deployed File Contract's address
        fc = FileContract(FileContractAddress);
    }
    
    // return no of files owned by this student
    function getFileCount() public view returns (uint) {
        return fc.getFileCount(msg.sender);
    }
    
    // return all files owned by this student
    function getFile() public view returns (FileContract.File[] memory) {
        return fc.getFile(msg.sender);
    }
    
}
