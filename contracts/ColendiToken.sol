pragma solidity ^0.5.8;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";

contract ColendiToken is ERC20 {

    using ECDSA for bytes32;

    string public name = "Colendi Token";

    string public symbol = "COD";

    uint8 public decimals = 18;

    uint256 public INITIAL_SUPPLY = 1e9 * (10 ** uint256(decimals));

    constructor() public {
        _mint(msg.sender, INITIAL_SUPPLY);

    }

    /// @dev User to Current Nonces
    mapping(address => uint256) public currentNonce;

    function metaTransfer(bytes calldata signature, address to, uint256 value, uint256 nonce, uint256 reward)
    external returns (bool) {
        bytes32 metaHash = metaTransferHash(to,value,nonce,reward);
        address signer = checkSignatureAndPayReward(metaHash, signature, nonce, reward);
        _transfer(signer, to, value);
        return true;
    }
    function metaTransferHash(address to, uint256 value, uint256 nonce, uint256 reward) public view returns(bytes32){
        return keccak256(abi.encodePacked(address(this),"metaTransfer", to, value, nonce, reward)).toEthSignedMessageHash();
    }

    function metaApprove(bytes calldata signature, address spender, uint256 value, uint256 nonce, uint256 reward)
    external returns (bool) {
        bytes32 metaHash = metaApproveHash(spender,value,nonce,reward);
        address signer = checkSignatureAndPayReward(metaHash, signature, nonce, reward);
        _approve(signer, spender, value);
        return true;

    }
    function metaApproveHash(address spender, uint256 value, uint256 nonce, uint256 reward) public view returns(bytes32){
        return keccak256(abi.encodePacked(address(this),"metaApprove", spender, value, nonce, reward)).toEthSignedMessageHash();
    }

    function metaTransferFrom(
        bytes calldata signature,address sender,address recipient,uint256 value,uint256 nonce,uint256 reward
    ) external returns (bool)
    {
        bytes32 metaHash = metaTransferFromHash(sender, recipient,value,nonce,reward);
        address signer = checkSignatureAndPayReward(metaHash, signature, nonce, reward);
        uint256 allowed = allowance(sender,signer);
        _transfer(sender, recipient, value);
        _approve(sender, signer, allowed.sub(value));
        return true;
    }
    function metaTransferFromHash(address sender, address recipient, uint256 value, uint256 nonce, uint256 reward)
    public view returns(bytes32){
        return keccak256(
            abi.encodePacked(address(this),"metaTransferFrom", sender, recipient, value, nonce, reward)
            ).toEthSignedMessageHash();
    }

    function recoverSigner(bytes32 messageHash, bytes calldata signature) external pure returns(address){
        return messageHash.recover(signature);
    }

    function approveAndCall(address target, uint256 amount, bytes calldata data) external returns(bool) {
        approve(target, amount);
        (bool isSucceed, ) = target.call(data);
        require(isSucceed, "Transaction has been reverted");
        return true;
    }

    function metaApproveAndCall(
        bytes calldata signature, address target, uint256 amount, bytes calldata data, uint256 nonce, uint256 reward, uint256 gasLimit
        ) external returns (bool) {
        uint256 startGas = gasleft();
        bytes32 metaHash = metaApproveAndCallHash(target,amount,data,nonce,reward,gasLimit);
        address signer = checkSignatureAndPayReward(metaHash, signature, nonce, reward, startGas, gasLimit);
        _approve(signer, target, amount);
        target.call(data);
        return true;

    }
    function metaApproveAndCallHash(address target, uint256 amount, bytes memory data, uint256 nonce, uint256 reward, uint256 gasLimit)
    public view returns(bytes32){
        return keccak256(
            abi.encodePacked(address(this),"metaApproveAndCall", target, amount, data, nonce, reward, gasLimit)
            ).toEthSignedMessageHash();
    }
    function checkSignatureAndPayReward(
        bytes32 metaHash, bytes memory signature, uint256 nonce, uint256 reward, uint256 startGas, uint256 gasLimit
    ) internal returns (address) {
        address signer = metaHash.recover(signature);
        require(startGas>=gasLimit,"Not enough gas provided by relayer");
        require(signer!=address(0), "ZERO_ADDRESS can not be signer");
        require(nonce == currentNonce[signer], "Can not execute replay attack");
        currentNonce[signer]++;
        if(reward>0){
            _transfer(signer, msg.sender, reward);
        }

        return signer;
    }

    function checkSignatureAndPayReward(
        bytes32 metaHash, bytes memory signature, uint256 nonce, uint256 reward) internal returns (address) {
        address signer = metaHash.recover(signature);
        require(signer!=address(0), "ZERO_ADDRESS can not be signer");
        require(nonce == currentNonce[signer], "Can not execute replay attack");
        currentNonce[signer]++;
        if(reward>0){
            _transfer(signer, msg.sender, reward);
        }

        return signer;
    }
}