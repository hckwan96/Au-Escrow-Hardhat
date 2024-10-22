#!/bin/bash

# Check if a transaction hash is provided
if [ $# -eq 0 ]; then
    echo "Please provide a transaction hash as an argument."
    exit 1
fi

# Store the transaction hash
TX_HASH=$1

# Run the Hardhat console commands
npx hardhat console --network localhost << EOF
(async () => {
  const txReceipt = await ethers.provider.getTransactionReceipt("$TX_HASH");
  console.log(JSON.stringify(txReceipt, null, 2));
  process.exit(0);
})();
EOF
