const { ethers } = require("hardhat");

async function getLatestBlock() {
    const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545"); // If using Hardhat node locally

    const latestBlock = await provider.getBlockNumber();
    console.log("Latest Block:", latestBlock);
}

getLatestBlock();
