// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract GoodContract {
    mapping(address => uint256) public balances;

    // Deposit balance based on value sent along with transaction
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    // Send ETH worth balance of sender back to sender
    function withdraw() public {
        // Must have more than 0 balance
        require(balances[msg.sender] > 0);

        // Attempt to transfer
        (bool sent, ) = msg.sender.call{value: balances[msg.sender]}("");
        require(sent, "Failed.");

        // Update balance
        balances[msg.sender] = 0;
    }
}
