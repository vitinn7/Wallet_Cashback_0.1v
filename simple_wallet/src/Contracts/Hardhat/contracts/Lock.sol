// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./openzeppelin/token/ERC20/ERC20.sol";


contract Simple_Token is ERC20 {
    address public owner;


    constructor(uint256 initialSupply, uint256 cashbackPercentage, uint256 cashbackThreshold, uint256 initialProductValue) ERC20("CARCARA", "CRC") {
        _mint(msg.sender, initialSupply);
        _mintP(msg.sender, initialProductValue);
        setCashbackParameters(cashbackPercentage, cashbackThreshold);
        owner = msg.sender;
    }



}
