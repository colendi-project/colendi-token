const ColendiToken = artifacts.require("./ColendiToken.sol");

module.exports = function (deployer) {
  deployer.deploy(ColendiToken)
};
