const SushiToken = artifacts.require("SushiToken");
const MasterChef = artifacts.require("MasterChef");
const Web3 = require('Web3');

module.exports = function (deployer) {
  deployer.then(async () => {
    try {
      await deployer.deploy(SushiToken);
      const sushiToken = await SushiToken.deployed();
      const blockNumber = await web3.eth.getBlockNumber();
      const accounts = await web3.eth.getAccounts();
      const devAddress = accounts[0];
      const bonusBlock = blockNumber + 100
      await deployer.deploy(MasterChef, sushiToken.address, devAddress, web3.utils.toWei(100), 1, bonusBlock)
      await sushiToken.transferOwnership(masterChef.address);
    } catch (error) {
      console.log(error)
    }
  })
};