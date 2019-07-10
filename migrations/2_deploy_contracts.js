const ColendiToken = artifacts.require("./ColendiToken.sol");
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({ region: 'us-east-1' });
const client = new AWS.DynamoDB.DocumentClient({ service: dynamodb });
const envVars = require('../utils/getEnv');
const argv = require('minimist')(process.argv.slice(2), { string: ['env'] });

module.exports = function (deployer) {
  const currentStage = argv['env'];
  
  // For development
  if (!currentStage) {
    console.log("Deploying on Development")
    deployer.deploy(ColendiToken)
  }

  // For SSM Integration
  else {
  console.log("Deploying with SSM Integration")
  deployer.deploy(ColendiToken)
    .then(() => ColendiToken.deployed())
    .then(async (_instance) => {
      await envVars.getEnvironmentVariables(currentStage);
      const outABI = JSON.stringify(_instance.abi, function(key, value) {
        if(value === "") {
            return null
        }    
        return value;
    });      
    const _abi = JSON.parse(outABI)
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
  }
};
