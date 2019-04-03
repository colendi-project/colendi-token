pragma solidity ^0.5.0;

import 'openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';

contract ColendiToken is ERC20 {

    string public name = 'Colendi Token';

    string public symbol = 'COD';

    uint8 public decimals = 18;

    uint256 public INITIAL_SUPPLY = 2e9 * (10 ** uint256(decimals));

    constructor() public {
        _mint(msg.sender, INITIAL_SUPPLY);      
    }

}