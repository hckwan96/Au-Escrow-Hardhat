const { ethers } = require("hardhat");

async function main() {
    const latestBlock = await ethers.provider.getBlock("latest");
    const blockTimestamp = latestBlock.timestamp;
    const date = new Date(blockTimestamp * 1000); // Convert to milliseconds

    console.log("Current Hardhat Node Time (UTC):", date.toUTCString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error);
      process.exit(1);
 });