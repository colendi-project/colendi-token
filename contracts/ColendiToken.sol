pragma solidity ^0.5.8;

import 'openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';
import "./ECRecovery.sol";

contract ColendiToken is ERC20 {

    using ECRecovery for bytes32;

    string public name = 'Colendi Token';

    string public symbol = 'COD';

    uint8 public decimals = 18;

    uint256 public INITIAL_SUPPLY = 1e9 * (10 ** uint256(decimals));

    constructor() public {
        _mint(msg.sender, INITIAL_SUPPLY);

    }

    /// @dev User to Current Nonces
    mapping(address => uint256) public currentNonce;

    function metaTransfer(bytes memory signature, address to, uint256 value, uint256 nonce, uint256 reward) public returns (bool) {
        bytes32 metaHash = metaTransferHash(to,value,nonce,reward);

        address signer = metaHash.recover(signature);
        require(signer!=address(0));
        require(nonce == currentNonce[signer]);
        currentNonce[signer]++;
        _transfer(signer, to, value);
        if(reward>0){
            _transfer(signer, msg.sender, reward);
        }
        return true;

    }
    function metaTransferHash(address to, uint256 value, uint256 nonce, uint256 reward) public view returns(bytes32){
        return keccak256(abi.encodePacked(address(this),"metaTransfer", to, value, nonce, reward));
    }

    function metaApprove(bytes memory signature, address spender, uint256 value, uint256 nonce, uint256 reward) public returns (bool) {
        bytes32 metaHash = metaApproveHash(spender,value,nonce,reward);

        address signer = metaHash.recover(signature);
        require(signer!=address(0));
        require(nonce == currentNonce[signer]);
        currentNonce[signer]++;
        _approve(signer, spender, value);
        if(reward>0){
            _transfer(signer, msg.sender, reward);
        }
        return true;

    }
    function metaApproveHash(address spender, uint256 value, uint256 nonce, uint256 reward) public view returns(bytes32){
        return keccak256(abi.encodePacked(address(this),"metaApprove", spender, value, nonce, reward));
    }

    function metaTransferFrom(bytes memory signature, address sender, address receipent, uint256 value, uint256 nonce, uint256 reward) public returns (bool) {
        bytes32 metaHash = metaTransferFromHash(sender, receipent,value,nonce,reward);

        address signer = metaHash.recover(signature);
        require(signer!=address(0));
        require(nonce == currentNonce[signer]);
        currentNonce[signer]++;
        uint256 allowed = allowance(sender,signer);
        _transfer(signer, receipent, value);
        _approve(sender, signer, allowed.sub(value));
        if(reward>0){
            _transfer(signer, msg.sender, reward);
        }
        return true;
    }
    function metaTransferFromHash(address sender, address receipent, uint256 value, uint256 nonce, uint256 reward) public view returns(bytes32){
        return keccak256(abi.encodePacked(address(this),"metaTransferFrom", sender, receipent, value, nonce, reward));
    }

    function recoverSigner(bytes32 messageHash, bytes memory signature) public view returns(address){
        return messageHash.recover(signature);
    }

    function approveAndCall(address target, uint256 amount, bytes memory data) public returns(bool) {
        approve(target, amount);
        bool isSucceed;
        (isSucceed, ) = target.call(data);
        require(isSucceed, "Transaction has been reverted");
        return true;
    }
}