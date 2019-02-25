const ColendiToken = artifacts.require("./ColendiToken.sol");
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({ region: 'us-east-1' });
const client = new AWS.DynamoDB.DocumentClient({ service: dynamodb });
const envVars = require('../utils/getEnv');
const cleanDeep = require('clean-deep')
const argv = require('minimist')(process.argv.slice(2), { string: ['env'] });

module.exports = function (deployer) {
  deployer.deploy(ColendiToken)
    .then(() => ColendiToken.deployed())
    .then(async (_instance) => {
      const currentStage = argv['env'];
      await envVars.getEnvironmentVariables(currentStage);
      const _abi = JSON.parse(JSON.stringify(_instance.abi).replace("\"\"",null))
      const params = {
        TableName: process.env.CONTRACTS_TABLE,
        Item: {
          contractName: "token",
          contractAddress: _instance.address,
          contractABI: _abi,
          providerID: deployer.network_id,
          providerKey: process.env.INFURA_KEY_KOVAN,
          providerURL: process.env.INFURA_URL_KOVAN,
        }
      };

      client.put(params, (error) => {
        if (error) {
          console.log(error);
        } else {
          console.log(params.Item);
        }
      });
    })
};
