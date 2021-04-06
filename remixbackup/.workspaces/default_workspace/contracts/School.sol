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
    uint public totalStudents;
    FileContract public fc;
    Student public s;
    address public FileContractAddress = 0x9841B68a56c7E70EAa8675AAE8629600dfBEBC96;  //set it later
    address public StudentContractAddress = 0x0bFCfA4092a19E9B78Eb32Eb4011B68b51Fbdb8e;  //set it later
    
    
    constructor() public {
        fc = FileContract(FileContractAddress);
        s = Student(StudentContractAddress);
    }

    
    //check is student is present in school
    function hasStudent (address _student, address _school) public view returns(bool) {
        // require(s.hasUser(_student));
        for(uint i=0;i<totalStudents;i++){
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
        // require(!hasStudent(_student, msg.sender));
        schoolStudents.push(_student);
        studentToSchool.push(msg.sender);
        studentCount[msg.sender]++;
        totalStudents++;
    }
    
    
    //return student details
    function getStudent (address _student) public view returns(user memory) {
        return s.getUser(_student);
    }
    
    
    //returns the no of students enrolled in a school
    function studentsCount (address _school) public view returns(uint) {
        return studentCount[_school];
    }
    
    
    //returns list of students if a school - called by company (maybe let school call this to produce a list of students to display on dashboard)
    function getStudents (address _school) public view returns(address[] memory) {
        address[] memory students = new address[](studentsCount(_school));
        uint id=0;
        for(uint i=0;i<totalStudents;i++){
            if(studentToSchool[i]==_school){
                students[id] = schoolStudents[i];
                id++;
            }
        }
        
        return students;
    }
    
    
    //lets school upload a file(with ipfs hash) for a student 
    function uploadFileSchool (string memory ipfsHash, string memory title, string memory description, address _student) public {
        this.hasStudent(_student, msg.sender);
        fc.uploadFile(ipfsHash, title, description, _student);
    }
    
    
    //returns the list of all schools - called by company
    function getSchools() public view returns (address[] memory) {
        return addressOfUser;
    }
    
    
    //how many files  exist for a student (maybe not needed)
    // function getFileCountSchool (address _student) public view returns(uint){
    //     require(s.hasUser(_student)); //if student exists
    //     require(msg.sender == studentToSchool[_student]);  //if student is a part of this school
    //     return s.getFileCount(_student);
    // }
    
    //returns all files of a student (maybe not needed)
    // function getFileSchool (address _student) public view returns(FileContract.File[] memory) {
    //     require(s.hasUser(_student)); //if student exists
    //     require(msg.sender == studentToSchool[_student]);  //if student is a part of this school
    //     return s.getFile(_student);
    // }
    
}