require('@nomicfoundation/hardhat-toolbox');
require("dotenv").config();

module.exports = {
  solidity: "0.8.17",
  paths: {
    artifacts: "./app/src/artifacts",
  },
  networks: {
    sepolia: {
      url: process.env.ALCHEMY_KEY,
      accounts: [process.env.TESTNET_PRIVATEKEY]
    },
  }
};
