// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    // defining our own constructor that allows us to set token name, symbol, and initial supply.
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _initialSuppy
    )ERC20(_name ,_symbol){
        _mint(msg.sender, _initialSuppy);

    }

}