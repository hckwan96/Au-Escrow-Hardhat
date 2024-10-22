const { ethers } = require("ethers");
const provider = new ethers.providers.JsonRpcProvider();
const Escrow = require('./app/src/artifacts/contracts/Escrow.sol/Escrow.json'); 

async function fetchApprovalTimestamp(contractAddress, provider) {
  const contract = new ethers.Contract(contractAddress, Escrow.abi, provider);

  // Filter for the "ContractApproved" event
  const filter = contract.filters.ContractApproved();
  const logs = await contract.queryFilter(filter);
console.log("lo",logs)
  if (logs.length > 0) {
      const approvalEvent = logs[logs.length - 1]; // Get the last approval event
      const approvalTimestampBN = approvalEvent.args.timestamp;

      // Convert the BigNumber to a number and then to a JavaScript Date
      const approvalTimestamp = new Date(approvalTimestampBN.toNumber() * 1000).toUTCString(); // Multiply by 1000 to convert to milliseconds

      return approvalTimestamp;
  }

  return null; // No approval event found
}

// Wrap the logic in an async IIFE (Immediately Invoked Function Expression)
(async () => {
  const contractAddress = process.argv[2]; // Gets the 3rd command-line argument

  if (contractAddress) {
    try {
      const ts = await fetchApprovalTimestamp(contractAddress, provider);
      if (ts) {
        console.log("Approval Timestamp (UTC):", ts);
      } else {
        console.log("No approval event found.");
      }
    } catch (error) {
      console.error('Error fetching approval timestamp:', error);
    }
  } else {
    console.log("Please provide a contract address as an argument.");
  }
})();
