const { ethers } = require("ethers");

async function getBlockNumberFromTxHash(txHash) {
  const provider = new ethers.providers.JsonRpcProvider(); // Connect to the Ethereum network

  try {
    // Get the transaction receipt
    const txReceipt = await provider.getTransactionReceipt(txHash);

    if (txReceipt && txReceipt.blockNumber) {
      console.log("Block Number:", txReceipt.blockNumber);
      return txReceipt.blockNumber;
    } else {
      console.log("Transaction not found or not mined yet.");
    }
  } catch (error) {
    console.error("Error retrieving transaction receipt:", error);
  }
}

// Retrieve the transaction hash passed as an argument
const txHash = process.argv[2]; // Gets the 3rd command-line argument

if (txHash) {
  getBlockNumberFromTxHash(txHash);
  getApprovalTimestamp(txHash)
} else {
  console.log("Please provide a transaction hash as an argument.");
}



async function getApprovalTimestamp(txHash) {
  const provider = new ethers.providers.JsonRpcProvider();
  const txReceipt = await provider.getTransactionReceipt(txHash, provider);
  const block = await provider.getBlock(txReceipt.blockNumber);
  console.log(txReceipt)
  console.log(`tx timestamp ${block.timestamp}`)
  return block.timestamp;
}