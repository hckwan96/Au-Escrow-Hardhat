const fs = require('fs');
const path = require('path');
const { ethers } = require("hardhat");

async function main() {
  const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");

  // Fetch the latest block number
  const latestBlock = await provider.getBlockNumber();

  console.log(`Scanning blocks from 0 to ${latestBlock} for contract creations...`);

  // Load all locally compiled contract bytecodes
  const contractArtifacts = [];
  const contractsDir = path.join(__dirname, './app/src/artifacts');

  // Function to read all .json files in subdirectories
  const loadContractArtifacts = (dir) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        // Recursively read directories
        loadContractArtifacts(fullPath);
      } else if (file.endsWith('.json')) {
        const contractData = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
        contractArtifacts.push({
          name: contractData.contractName,
          bytecode: contractData.deployedBytecode,
        });
      }
    }
  };

  // Load the contract artifacts
  loadContractArtifacts(contractsDir);

  // Scan each block for contract creations
  for (let i = 0; i <= latestBlock; i++) {
    const block = await provider.getBlockWithTransactions(i);

    for (const tx of block.transactions) {
      // Check if the transaction is a contract creation
      if (tx.to === null) {
        const receipt = await provider.getTransactionReceipt(tx.hash);
        const deployedAddress = receipt.contractAddress;
        console.log(`Contract created at address: ${deployedAddress} in block ${i}`);

        // Fetch deployed bytecode
        const deployedBytecode = await provider.getCode(deployedAddress);

        // Compare with local artifacts to find the contract name
        for (const artifact of contractArtifacts) {
          if (artifact.bytecode && deployedBytecode.startsWith(artifact.bytecode)) {
            console.log(`Contract name: ${artifact.name}`);
            break;
          }
        }
      }
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
