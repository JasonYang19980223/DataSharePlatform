const Storage = artifacts.require("Storage");
const Platform = artifacts.require("Platform");

module.exports = function(deployer) {
  deployer.deploy(Storage);
  deployer.deploy(Platform);
};
