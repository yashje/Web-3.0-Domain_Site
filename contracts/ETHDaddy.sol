// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ETHDaddy is ERC721 {
    address public owner;
    uint256 public maxSupply;
    uint256 public totalSupply;

    //domain struct
    struct domain {
        string name;
        uint256 cost;
        bool isOwned;
    }

    modifier onlyOwner() {
        require(owner == msg.sender);
        _;
    }

    mapping(uint256 => domain) domains;

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        owner = msg.sender;
    }

    //list the domain
    function listDomain(string memory _name, uint256 _cost) public onlyOwner {
        maxSupply++;
        domains[1] = domain(_name, _cost, false);
    }

    //mint function
    function mint(uint256 _id) public payable {
        require(_id != 0);
        require(_id <= maxSupply );
        require(domains[_id].isOwned == false);
        require(msg.value >= domains[_id].cost);

        domains[_id].isOwned = true;
        totalSupply++;
        _safeMint(msg.sender, _id);
    }

    //function to get domain
    function getDomain(uint256 _id) public view returns (domain memory) {
        return domains[_id];
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
