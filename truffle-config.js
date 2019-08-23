const HDWalletProvider = require("truffle-hdwallet-provider");

const providerKey = process.env.INFURA_KEY_KOVAN;
const mnemonic = process.env.MNEMONIC;
const gasPrice = process.env.GAS_PRICE;
const gasAmount = process.env.GAS_AMOUNT;

module.exports = {
    networks: {
        development: {
            host: "localhost",
            port: 8545,
            network_id: "*"
        },
        kovan: {
            gasPrice: gasPrice,
            gas: gasAmount,
            provider: () => {
                return new HDWalletProvider(mnemonic, ("https://kovan.infura.io/v3/" + providerKey));
            },
            network_id: 42
        },
        rinkeby: {
            gasPrice: gasPrice,
            gas: gasAmount,
            provider: () => {
                return new HDWalletProvider(mnemonic, ("https://rinkeby.infura.io/v3/" + providerKey));
            },
            network_id: 4
        },
        ropsten: {
            gasPrice: gasPrice,
            gas: gasAmount,
            provider: () => {
                return new HDWalletProvider(mnemonic, ("https://ropsten.infura.io/v3/" + providerKey));
            },
            network_id: 3
        },
        mainnet: {
            gasPrice: gasPrice,
            gas: gasAmount,
            provider: () => {
                return new HDWalletProvider(mnemonic, ("https://mainnet.infura.io/v3/" + providerKey));
            },
            network_id: 1,
            skipDryRun: true
        },
    },
    mocha: {
        // timeout: 100000
        reporter: 'eth-gas-reporter',
        reporterOptions: {
            currency: 'USD',
        }
    },

    // Configure your compilers
    compilers: {
        solc: {
            version: "0.5.8", // Fetch exact version from solc-bin (default: truffle's version)
            docker: false, // Use "0.5.1" you've installed locally with docker (default: false)
            settings: { // See the solidity docs for advice about optimization and evmVersion
                optimizer: {
                    enabled: true,
                    runs: 200
                },
                evmVersion: "byzantium"
            }
        }
    }
};

