// SPDX-License-Identifier: CC-BY-SA-4.0

pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;
import './Student.sol';
import './FileContract.sol';
import './Company.sol';
import './Request.sol';


contract ShareFiles {
    
    Student s;
    FileContract f;
    Company c;
    
    //set later
    address sa = 0x0bFCfA4092a19E9B78Eb32Eb4011B68b51Fbdb8e;
    address fa = 0x9841B68a56c7E70EAa8675AAE8629600dfBEBC96;
    address ca = 0xEA1E64339565f747c4cBFdD26885FF9bfA06BA54;

    mapping(address => mapping(address => uint[])) public sharedFiles;
    mapping(address => uint) sharedCount;
    
    constructor() public {
        s = Student(sa);
        f = FileContract(fa);
        c = Company(ca);
    }
    
    function shareFileIndex (uint[] memory toBeShared, address _company) public {
        sharedFiles[msg.sender][_company] = toBeShared;
        sharedCount[msg.sender] += toBeShared.length;
    }
    
    function getSharedFilesCount (address _student) public view returns(uint) {
        return sharedCount[_student];
    }
    
    function getSharedFiles (address _student) private view returns(uint[] memory) {
        return sharedFiles[_student][msg.sender];
    }
    
    function getFile (address _student) public view returns(FileContract.File[] memory) {
        FileContract.File[] memory files = f.getFile(_student);
        uint[] memory shared = getSharedFiles(_student);
        FileContract.File[] memory filesShared = new FileContract.File[](shared.length);
        for(uint i=0;i<shared.length;i++){
            filesShared[i] = files[shared[i]];
        }
        
        return filesShared;
    }
}