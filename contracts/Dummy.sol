pragma solidity ^0.5.8;
import "./ColendiToken.sol";
contract Dummy {
    ColendiToken colendiToken;
    uint256 public random;

    constructor(address tokenAddress) public {
        colendiToken = ColendiToken(tokenAddress);
    }

    function setValue(address sender, uint256 val) public returns(bool){
        require(colendiToken.transferFrom(sender,address(this),2e18), "Transfer Not Executed");
        random = val;
        return true;
    }
}
