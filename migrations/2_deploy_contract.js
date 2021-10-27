const Storage = artifacts.require("Storage");
const Member = artifacts.require("Member");

module.exports = function(deployer) {
  deployer.deploy(Storage);
  deployer.deploy(Member);
};
