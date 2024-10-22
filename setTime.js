const { ethers } = require("hardhat");

async function main() {
    // Get the current time in seconds since the epoch
    const currentTime = Math.floor(Date.now() / 1000); 

    // Set the next block timestamp to the current time
    await ethers.provider.send("evm_setNextBlockTimestamp", [currentTime]);

    // Mine the next block
    await ethers.provider.send("evm_mine");

    // Retrieve the latest block to confirm the time
    const latestBlock = await ethers.provider.getBlock("latest");
    console.log("Current Hardhat Node Time (UTC):", new Date(latestBlock.timestamp * 1000).toUTCString());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
