// SPDX-License-Identifier: CC-BY-SA-4.0

pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;
import './FileContract.sol';
import './School.sol';

contract Company is TestUser{
    FileContract public fc;
    School public s;
    
    //set later
    address public fca = 0x2B382c265570168FE9F2a227C8B9B0B8c4E5FDA8;
    address public sa = 0xAdfb83c601c034Cf4CD408acfd40cb2D9Ce9f962;
    
    constructor() public {
        fc = FileContract(fca);
        s = School(sa);
    }
    
    //get all possible schools
    function getSchoolAddresses () public view returns (address[] memory) {
        return s.getSchools();
    }
    
    function getSchoolStudentsAddresses (address _school) public view returns(address[] memory) {
        return s.getStudents(_school);
    }
}
