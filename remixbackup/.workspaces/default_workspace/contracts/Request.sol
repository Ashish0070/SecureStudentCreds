// SPDX-License-Identifier: CC-BY-SA-4.0

pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

contract Request {
    
    struct request {
        address sender;
        address receiver;
        string description;
    }
    
    request[] public sentRequests;
    uint sentCurr;
    request[] public receivedRequests;
    uint recvdCurr;
    
    mapping(uint => address) sent;
    mapping(uint => address) recvd;
    mapping(address => uint) sentCount;
    mapping(address => uint) recvdCount;
    
    function sendRequest (address _receiver, string memory _description) public {
        // how to check validity of destination address
        sentRequests.push(request(msg.sender, _receiver, _description));
        receivedRequests.push(sentRequests[sentCurr]);
        sent[sentCurr] = msg.sender;
        recvd[recvdCurr] = _receiver;
        sentCount[msg.sender]++;
        recvdCount[_receiver]++;
        sentCurr++;
        recvdCurr++;
    }
    
    function getSentRequestCount () private view returns(uint) {
        return sentCount[msg.sender];
    }
    
    function getReceivedRequestCount () private view returns(uint) {
        return recvdCount[msg.sender];
    }
    
    function getReceivedRequest () public view returns(request[] memory) {
        request[] memory req = new request[](getReceivedRequestCount());
        uint curr=0;
        for(uint i=0;i<receivedRequests.length;i++){
            if(recvd[i]==msg.sender){
                req[curr] = receivedRequests[i];
                curr++;
            }
        }
        return req;
    }
    
    function getSentRequest () public view returns(request[] memory) {
        request[] memory req = new request[](getSentRequestCount());
        uint curr=0;
        for(uint i=0;i<sentRequests.length;i++){
            if(sent[i]==msg.sender){
                req[curr] = sentRequests[i];
                curr++;
            }
        }
        return req;
    }
    
}