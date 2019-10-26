<p align="center">
  <a href="https://www.colendi.com" target="_blank">
    <img src="https://www.colendi.com/assets/img/logo.png" alt="Colendi">
  </a>
</p>
<br/>

# Colendi Token

Colendi Token is a ERC-20 token which is built based on open-zeppelin ERC-20 contract. Colendi platform aims to provide a better User Experience for end-users. Whereas, on Ethereum users are asked to have Ether in addition to any utility tokens. Mass adoption of blockchains requires frictionless user onboarding. There has been lots of proposals on this purporse like 

  * ERC-1776 by Austin Griffith - Native Meta Transactions
  * ERC-865 Pay transfers in tokens instead of gas
  * ERC-827 The execution of calls inside transfer and approvals
  * ERC-677 Transfer and Call

In addition to these proposals, the organizations are built like The Gas Station Network Alliance. Colendi aims to facilitate the interactions of the user with the extended version of ERC-20. Our extensions are as follows : 

  * approveAndCall
  * metaTransfer
  * metaTransferFrom
  * metaApprove
  * metaApproveAndCall

![Generic badge](https://img.shields.io/badge/maintained-yes-green.svg)

## Table of Contents
| Network  | Address  |
|---|---|
|  Mainnet | 0xf2ccd161f06d88479b50d4bedbad9992dbdaffdd |
| Kovan | 0x35A19cdAE55bFc0F7f63e38a2c97732bB927E5d7 |

- [Colendi Token](#Colendi-Token)
  - [Table of Contents](#Table-of-Contents)
  - [Features](#Features)
    - [Methods](#Methods)
      - [metaTransfer](#metaTransfer)
      - [metaApprove](#metaApprove)
      - [metaTransferFrom](#metaTransferFrom)
      - [approveAndCall](#approveAndCall)
      - [metaApproveAndCall](#metaApproveAndCall)
  - [Getting Started](#Getting-Started)
    - [Contract Compilation, Migration and Tests](#Contract-Compilation-Migration-and-Tests)
    - [Prerequisites](#Prerequisites)
    - [Related Docs](#Related-Docs)
  - [API Reference](#API-Reference)
  - [Contribution](#Contribution)
    - [Issues & Feedback](#Issues--Feedback)
  - [License](#License)

## Features

The features of Colendi Token are as follows:

| Property  | Value  |
|---|---|
|  Name | Colendi Token |
| Symbol | COD |
| Decimal | 18 |
| Supply | 1000000000 |

### Methods

#### metaTransfer

This method is based on Austin Griffith's [native-meta-transaction](https://github.com/austintgriffith/native-meta-transactions). It allows transferring COD tokens without having ETH. The transaction fee is paid in terms of COD to relayer and the relayer routes signed transaction to contract covering fee.

#### metaApprove

This method allows providing access to anyone for some amount of tokens owned by the user. Currently, most of utility tokens follow approve and transferFrom pattern. Yet it is proven to be secure so far, the user requires ETH to cover at least 2 transactions on network. With this function, user can be less affected of fluctating Transaction fees. 

#### metaTransferFrom

This method allows transferring COD tokens without having ETH on behalf of someone. It would be useful for some decentralized applications. The transaction fee is paid in terms of COD to relayer and the relayer routes signed transaction to contract covering fee.

#### approveAndCall 

This method is a replacement for approve & transferFrom pattern. In this case, the user can directly execute the same functionality in just one transaction. 

#### metaApproveAndCall

This methods allows executing approveAndCall method without having ETH. 

## Getting Started

* You can clone the directory onto your local machine and install dependencies
```
    npm install
```
**NOTE THAT** YOU CAN USE NPM OR YARN AS PACKAGE MANAGER
```
    yarn install
```
* Considering common programming paradigms, we integrated our contract deployment within continuous integration practice. The developers can also benefit from the pattern we followed. And, you can also choose to continue without configuring AWS or similar services.

### Contract Compilation, Migration and Tests
Export environment variables
```
    export infuraKey="INFURA_KEY"
    export mnemonic="MNEMONIC MNEMONIC ..."
    export gasPrice="2000000000"
    export gasAmount="6000000"
```
You can deploy the contract to Kovan, Rinkeby, Ropsten, Mainnet or local ganache network.

```
// Mainnet
    truffle migrate --network mainnet --reset
// Kovan
    truffle migrate --network kovan --reset
// Rinkeby
    truffle migrate --network rinkeby --reset
```

You can test your contract after running a local ganache network.
```
    > ganache-cli
    > truffle-test
```

Alternatively, you can test using `solidity-coverage` with following command and get coverage report along with tests.
```
    > ./node_modules/.bin/solidity-coverage
```

### Prerequisites

* Node-js (Above version 8)
* Npm (Above version 6)

### Related Docs
* [Truffle](https://truffleframework.com/)
* [ERC-20 Standard](https://eips.ethereum.org/EIPS/eip-20)


## API Reference
public doc link: [Docs](https://docs.colendilabs.com/)

## Contribution

Contribute us:

1. Fork this repository
2. Clone to the local machine
3. Create a branch and make changes
4. Commit changes with clear explanation
5. Push changes to Github
6. Open a Pull Request

### Issues & Feedback

Feel free to submit issues and enhancement requests
<br/>email: tech@colendi.com 

## License

Colendi Token is provided under Apache License version 2.0. See LICENSE.md for more details.
