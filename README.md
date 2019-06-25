<p align="center">
  <a href="https://www.colendi.com" target="_blank">
    <img src="https://www.colendi.com/assets/img/logo.png" alt="Colendi">
  </a>
</p>
<br/>

# Colendi Token

Colendi Token is a ERC-20 token which is built using zeppelin ERC-20 contract. 

![Generic badge](https://img.shields.io/badge/maintained-yes-green.svg)

## Table of Contents
| Network  | Address  |
|---|---|
|  Mainnet | TBA |
| Kovan | 0x8375383B58124E6e76Fc422FF8014Ef6Ad1382E7 |

- [Colendi Token](#colendi-token)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Getting Started](#getting-started)
    - [Without Continous Integration](#without-continous-integration)
    - [Enabling Continous Integration](#enabling-continous-integration)
    - [Prerequisites](#prerequisites)
    - [Related Docs](#related-docs)
  - [API Reference](#api-reference)
  - [Contribution](#contribution)
    - [Issues & Feedback](#issues--feedback)
  - [License](#license)

## Features

The features of Colendi Token are as follows:

| Property  | Value  |
|---|---|
|  Name | Colendi Token |
| Symbol | COD |
| Decimal | 18 |
| Supply | 2000000000 |

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

### Without Continous Integration
Export environment variables
```
    export infuraURLKovan="INFURA_URL"
    export infuraKeyKovan="INFURA_KEY"
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

### Enabling Continous Integration

The integration and environment management is an import concern. It allows us to reduce time cost of development for client-side. We use the following tools :
* AWS Systems Manager Parameter Store : for configuration data management and secrets management
* AWS Code Pipeline : Continous delivery service that automates releases.

Before starting you have to define following secrets into AWS parameter store.
```
MNEMONIC
INFURA_URL_KOVAN
INFURA_KEY_KOVAN
gasPrice
gasAmount
CONTRACTS_TABLE
```

Then you can just run following command which will deploy the contracts and export ABI and adress of the contract to DynamoDB. For development environment;
```
npm run start:dev
yarn start:dev
```
### Prerequisites

* Node-js (Above version 8)
* Npm (Above version 6)

### Related Docs
* [Truffle](https://truffleframework.com/)
* [Code Pipeline](https://aws.amazon.com/codepipeline/)
* [Code Build](https://aws.amazon.com/codebuild/)
* [DynamoDB](https://aws.amazon.com/dynamodb/)
* [Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-paramstore.html)
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
