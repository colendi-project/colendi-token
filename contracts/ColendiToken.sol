pragma solidity ^0.4.23;

import 'openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol';

contract ColendiToken is StandardToken {

    string public name = 'Colendi Token';

    string public symbol = 'COD';

    uint8 public decimals = 3;

    uint public INITIAL_SUPPLY = 200000000000;

    constructor() public {
        totalSupply_ = INITIAL_SUPPLY;
        balances[msg.sender] = INITIAL_SUPPLY;
    }

}