// SPDX-License-Identifier: CC-BY-SA-4.0

pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;
import './User.sol';
import './FileContract.sol';
import './Student.sol';


contract School is User {
    
    address[] schoolStudents;
    bool studentInSchool;
    address[] schoolStudent;
    FileContract fc;
    Student s;
    
    
    constructor() public {
        fc = new FileContract();
        s = new Student();
    }

    function addStudent (address a) public {
        if()
    }
    
}