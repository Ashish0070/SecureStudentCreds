// SPDX-License-Identifier: CC-BY-SA-4.0

pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;
import './FileContract.sol';
import './Student.sol';
import './TestUser.sol';


contract School is TestUser {
    
    address[] public schoolStudents;
    address[] public studentToSchool;
    mapping(address=>uint) public studentCount;
    uint public totalStudentsEnrolled;
    FileContract public fc;
    Student public s;
    address public FileContractAddress = 0x2B382c265570168FE9F2a227C8B9B0B8c4E5FDA8;  //set it later
    address public StudentContractAddress = 0x4c9dE3d4a770a32AD8d8989993ef190d129FeD9b;  //set it later
    
    
    constructor() public {
        fc = FileContract(FileContractAddress);
        s = Student(StudentContractAddress);
    }

    
    //check if student is present in school
    function hasStudentInSchool (address _student, address _school) public view returns(bool) {
        require(s.hasStudentUser(_student));
        for(uint i=0;i<totalStudentsEnrolled;i++){
            if(schoolStudents[i]==_student){
                if(studentToSchool[i]==_school){
                    return true;
                }
            }
        }
        return false;
    }
    
    
    //add  student to school - only school calls this function to enrol student to itself
    function addStudent (address _student) public {
        require(!hasStudentInSchool(_student, msg.sender));
        schoolStudents.push(_student);
        studentToSchool.push(msg.sender);
        studentCount[msg.sender]++;
        totalStudentsEnrolled++;
    }
    
    
    //return student details
    function getStudent (address _student) public view returns(user memory) {
        return getStudentUser(_student);
    }
    
    
    //returns the no of students enrolled in a school
    function studentsCount (address _school) public view returns(uint) {
        return studentCount[_school];
    }
    
    
    //returns list of students if a school - called by company (maybe let school call this to produce a list of students to display on dashboard)
    function getStudents (address _school) public view returns(address[] memory) {
        address[] memory studentsEnrolled = new address[](studentsCount(_school));
        uint id=0;
        for(uint i=0;i<totalStudentsEnrolled;i++){
            if(studentToSchool[i]==_school){
                studentsEnrolled[id] = schoolStudents[i];
                id++;
            }
        }
        
        return studentsEnrolled;
    }
    
    
    //lets school upload a file(with ipfs hash) for a student 
    function uploadFileSchool (string memory ipfsHash, string memory title, string memory description, address _student) public {
        require(hasStudentInSchool(_student, msg.sender));
        fc.uploadFile(ipfsHash, title, description, _student);
    }
    
    
    //returns the list of all schools - called by company
    function getSchools() public view returns (address[] memory) {
        return addressOfSchools;
    }
    
}
