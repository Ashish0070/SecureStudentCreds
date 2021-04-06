// SPDX-License-Identifier: CC-BY-SA-4.0

pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;
import './FileContract.sol';
import './School.sol';

contract Company is TestUser{
    FileContract public fc;
    School public s;
    
    //set later
    address public fca = 0x9841B68a56c7E70EAa8675AAE8629600dfBEBC96;
    address public sa = 0xaa8bF279540b0341d310bCD91f0cDe0C9A9A4694;
    
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