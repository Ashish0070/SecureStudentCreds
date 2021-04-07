// SPDX-License-Identifier: CC-BY-SA-4.0

pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

contract TestUser {
    
    struct user{
        string name;
        string designation;
    }
    
    user[] public users; //for storing all user structs
    address[] public addressOfUser; //id of user to address
    uint public totalUsers; //total users
    
    user[] public students;
    user[] public schools;
    user[] public companies;
    
    address[] public addressOfStudents;
    address[] public addressOfSchools;
    address[] public addressOfCompanies;
    
    uint public totalStudents;
    uint public totalSchools;
    uint public totalCompanies;

    
    //misc string equality
    function equalsString(string memory _first,string memory _second) public pure returns (bool) {
        // Just compare the output of hashing all fields packed
        return keccak256(abi.encodePacked(_first)) == keccak256(abi.encodePacked(_second));
    }
    
    
    function hasUser(address _a) public view returns (bool) { 
        for(uint i=0;i<this.totalUsers();i++)
            if(this.addressOfUser(i)==_a)
                return true;
        
        return false;
    }
    
    //student user created or not
    function hasStudentUser(address _a) public view returns (bool) {
        for(uint i=0;i<totalStudents;i++)
            if(addressOfStudents[i]==_a)
                return true;
        
        return false;
    }
   
    //school user created or not 
    function hasSchoolUser(address _a) public view returns (bool) {
        for(uint i=0;i<totalSchools;i++)
            if(addressOfSchools[i]==_a)
                return true;
        
        return false;
    }
    
     //company user created or not
    function hasCompanyUser(address _a) public view returns (bool) {
        for(uint i=0;i<totalCompanies;i++)
            if(addressOfCompanies[i]==_a)
                return true;
        
        return false;
    }
    
    
    //create user and put into correct array acc to designation
    function createUser(string memory name, string memory designation) public {
        
        //check if user from this address already exists
        require(!hasUser(msg.sender));
        
        //create a new user
        users.push(user(name, designation));
        addressOfUser.push(msg.sender);
        totalUsers++;
        
        if(equalsString(designation, "Student")){
            students.push(user(name, designation));
            addressOfStudents.push(msg.sender);
            totalStudents++;
        }
        
        if(equalsString(designation, "School")){
            schools.push(user(name, designation));
            addressOfSchools.push(msg.sender);
            totalSchools++;
        }
        
        if(equalsString(designation, "Company")){
            companies.push(user(name, designation));
            addressOfCompanies.push(msg.sender);
            totalCompanies++;
        }
    }
    
    //return address of user
    function getUserAddress(string memory name, string memory designation) public view returns (address) {
        for(uint i=0;i<totalUsers;i++)
            if(equalsString(name, users[i].name) && equalsString(designation, users[i].designation))
                return this.addressOfUser(i);
    }
    
    //return address of student
    function getStudentAddress(string memory name, string memory designation) public view returns (address) {
        require(equalsString(designation, "Student"));
        for(uint i=0;i<totalStudents;i++)
            if(equalsString(name, students[i].name) && equalsString(designation, students[i].designation))
                return addressOfStudents[i];
    }
    
    //return address of School
    function getSchoolAddress(string memory name, string memory designation) public view returns (address) {
        require(equalsString(designation, "School"));
        for(uint i=0;i<totalSchools;i++)
            if(equalsString(name, schools[i].name) && equalsString(designation, schools[i].designation))
                return addressOfSchools[i];
    }
    
    //return address of Company
    function getCompanyAddress(string memory name, string memory designation) public view returns (address) {
        require(equalsString(designation, "Company"));
        for(uint i=0;i<totalCompanies;i++)
            if(equalsString(name, companies[i].name) && equalsString(designation, companies[i].designation))
                return addressOfCompanies[i];
    }
    
    //get user struct from address
    function getUser(address _a) public view returns (user memory) {
        for(uint i=0;i<totalUsers;i++)
            if(this.addressOfUser(i)==_a)
                return users[i];
    }
    
    //get student details from address
    function getStudentUser(address _student) public view returns (user memory) {
        for(uint i=0;i<totalStudents;i++)
            if(addressOfStudents[i]==_student)
                return students[i];
    }
    
    //get school details from address
    function getSchoolUser(address _school) public view returns (user memory) {
        for(uint i=0;i<totalSchools;i++)
            if(addressOfSchools[i]==_school)
                return schools[i];
    }
    
    //get student details from address
    function getCompanyUser(address _company) public view returns (user memory) {
        for(uint i=0;i<totalCompanies;i++)
            if(addressOfCompanies[i]==_company)
                return companies[i];
    }
    
}
