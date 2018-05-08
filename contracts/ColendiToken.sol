pragma solidity ^0.4.21;

import 'openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol';

contract ColendiToken is StandardToken {

    string public name = 'Colendi Token';

    string public symbol = 'COD';

    uint8 public decimals = 3;

    uint256 public constant INITIAL_SUPPLY = 200000000 * (10 ** uint256(decimals));

    function ColendiToken() public {
        totalSupply_ = INITIAL_SUPPLY;
        balances[msg.sender] = INITIAL_SUPPLY;
        emit Transfer(0x0, msg.sender, INITIAL_SUPPLY);
    }

}