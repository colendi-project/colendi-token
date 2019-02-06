const HDWalletProvider = require("truffle-hdwallet-provider");

const infuraURLKovan = process.env.INFURA_URL_KOVAN;
const infuraKeyKovan = process.env.INFURA_KEY_KOVAN;
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
                return new HDWalletProvider(mnemonic, (infuraURLKovan+infuraKeyKovan));
          },
          network_id: 42
        } 
    }
};