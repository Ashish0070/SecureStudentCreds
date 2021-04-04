// SPDX-License-Identifier: CC-BY-SA-4.0

pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;
import './FileContract.sol';
import './School.sol';

contract Company is User{
    FileContract fc;
    School s;
    
    //set later
    address fca = 0xb9d76A0C78338f6622a2364afeC9e60CCB8e7B35;
    address sa = 0x131872D29746Ec98748b5A064FA3b53c04932B95;
    
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