var TlwToken = artifacts.require("TlwToken");

module.exports = function(deployer) {
  deployer.deploy(TlwToken);
};