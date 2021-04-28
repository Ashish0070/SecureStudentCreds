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
    address sa = 0x4c9dE3d4a770a32AD8d8989993ef190d129FeD9b;
    address fa = 0x2B382c265570168FE9F2a227C8B9B0B8c4E5FDA8;
    address ca = 0xdAf4E46101c83F7b27383272fb114dfF3F904576;

    mapping(uint => uint[]) public sharedFiles;
    mapping(uint => uint) public sharedCount;
    
    constructor() public {
        s = Student(sa);
        f = FileContract(fa);
        c = Company(ca);
    }
    
    //share the specified files with the Company
    function shareFileIndex (uint[] memory toBeShared, address _company) public {
        uint hash = uint(keccak256(abi.encodePacked(msg.sender))) + uint(keccak256(abi.encodePacked(_company)));
        uint[] storage alreadyShared = sharedFiles[hash];
        for(uint i=0;i<toBeShared.length;i++){
            alreadyShared.push(toBeShared[i]);
        }
        sharedFiles[hash] = alreadyShared;
        sharedCount[hash] += toBeShared.length;
    }
    
    //how many files shared with a Company
    function getSharedFilesCount (address _student, address _company) public view returns(uint) {
        uint hash = uint(keccak256(abi.encodePacked(_student))) + uint(keccak256(abi.encodePacked(_company)));
        return sharedCount[hash];
    }
    
    //companies accessing shared files indices by a student
    function getSharedFiles (address _student) private view returns(uint[] memory) {
        uint hash = uint(keccak256(abi.encodePacked(msg.sender))) + uint(keccak256(abi.encodePacked(_student)));
        return sharedFiles[hash];
    }
    
    //get all files shared by a student to this Company(security loophole right now)
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
