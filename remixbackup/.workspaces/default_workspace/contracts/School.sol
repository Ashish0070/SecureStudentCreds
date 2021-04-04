// SPDX-License-Identifier: CC-BY-SA-4.0

pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;
import './User.sol';
import './FileContract.sol';
import './Student.sol';


contract School is User {
    
    address[] public schoolStudents;
    mapping(address=>address) public studentToSchool;
    mapping(address=>uint) public studentCount;
    FileContract fc;
    Student s;
    
    address FileContractAddress = 0xb9d76A0C78338f6622a2364afeC9e60CCB8e7B35;  //set it later
    address StudentContractAddress = 0xc0d0e6311f5A3FCfB23da3dE9f6D2768eC3F546D;  //set it later
    
    
    constructor() public {
        fc = FileContract(FileContractAddress);
        s = Student(StudentContractAddress);
    }

    //add  student to school - only school calls this function to enrol student to itself
    function addStudent (address _student) public {
        require(!hasStudent(_student, msg.sender));
        schoolStudents.push(_student);
        studentToSchool[_student] = msg.sender;
        studentCount[msg.sender]++;
    }
    
    //check is student is present in school
    function hasStudent (address _student, address _school) private view returns(bool) {
        require(s.hasUser(_student));
        return studentToSchool[_student] == _school;
    }
    
    //return student details
    function getStudent (address _student) public view returns(user memory) {
        return s.getUser(_student);
    }
    
    //returns list of students if a school - called by company (maybe let school call this to produce a list of students to display on dashboard)
    function getStudents (address _school) public view returns(address[] memory) {
        address[] memory students = new address[](studentCount[_school]);
        uint id=0;
        for(uint i=0;i<schoolStudents.length;i++){
            if(studentToSchool[schoolStudents[i]]==_school){
                students[id] = schoolStudents[i];
                id++;
            }
        }
        
        return students;
    }
    
    //returns the no of students enrolled in a school
    function studentsCount (address _school) public view returns(uint) {
        return studentCount[_school];
    }
    
    //lets school upload a file(with ipfs hash) for a student 
    function uploadFileSchool (string memory ipfsHash, string memory title, string memory description, address _student) public {
        require(s.hasUser(_student)); //if student exists
        require(msg.sender == studentToSchool[_student]);  //if student is a part of this school
        fc.uploadFile(ipfsHash, title, description, _student);
    }
    
    //returns the list of all schools - called by company
    function getSchools() public view returns (address[] memory) {
        address[] memory schools = new address[](users.length);
        for(uint i=0;i<users.length;i++){
            schools[i] = addressOfUser[i];
        }
        
        return schools;
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