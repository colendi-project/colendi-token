const HDWalletProvider = require("truffle-hdwallet-provider-privkey");

const privateKey = "[Private Key]";
const infuraKey = "[Infura Key]";

module.exports = {
    networks: {
        development: {
            host: "127.0.0.1",
            port: 8545,
            network_id: "*"
        },
        rinkeby: {
            provider: () => {
                return new HDWalletProvider(privateKey, "https://rinkeby.infura.io/" + infuraKey);
            },
            network_id: 4
        }
    }
};
