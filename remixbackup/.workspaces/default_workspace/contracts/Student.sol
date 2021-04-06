// SPDX-License-Identifier: CC-BY-SA-4.0

pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;
import './FileContract.sol';
import  './TestUser.sol';

contract Student is TestUser{
    
    FileContract public fc;  //all files owned by a student
    address public FileContractAddress = 0x9841B68a56c7E70EAa8675AAE8629600dfBEBC96;  //set it later(deployed one)
    
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