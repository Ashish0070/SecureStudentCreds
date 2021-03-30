// SPDX-License-Identifier: CC-BY-SA-4.0

pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;
import './FileContract.sol';

contract Student {
    
    FileContract fc;  //all files owned by a student
    address FileContractAddress;  //set it later(deployed one)
    
    constructor() public {
        //create an instance of File Contract using the deployed File Contract's address
        fc = FileContract(FileContractAddress);
    }
    
    function getFileCount() public view returns (uint) {
        // return no of files owned by this student
        return fc.getFileCount();
    }
    
    function getFile() public view returns (FileContract.File memory) {
        // return all files owned by this student
        return fc.getFile();
    }
    
}