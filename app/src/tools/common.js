import Escrow from '../artifacts/contracts/Escrow.sol/Escrow.json';
import { ethers } from 'ethers';

export const formatAddress = (address, disp='l') => {
  if (!address) return address;

  const windowWidth = window.innerWidth;
  if (disp === "l")
  {
    if(windowWidth>600) return address;
    
    const char = 4;
    return `${address.substring(0, char + 2)}...${address.substring(address.length - char, address.length)}`;
  }
  else
  {
    const char = 4;
    return `${address.substring(0, char + 2)}...${address.substring(address.length - char, address.length)}`;
  }
}

export function formatNumber(number, digit = 15)
{
  if (number < 1)
    return new Intl.NumberFormat("en-GB", {
        maximumFractionDigits: digit,
      }).format(number);
  else
    return new Intl.NumberFormat("en-GB").format(number);
}

export function formatTimestamp(timestamp) {
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    //month: "2-digit",
    month: "short",
    day: "2-digit",
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "UTC",
    timeZoneName:"short",
  }).format(timestamp * 1000);
}

async function getBlockNumberFromTxHash(txHash, provider) {
  try {
    const txReceipt = await provider.getTransactionReceipt(txHash);

    if (txReceipt && txReceipt.blockNumber) {
      return txReceipt.blockNumber;
    }
    else {
      console.log("Transaction not found or not mined yet.");
    }
  }
  catch (error) {
    console.error("Error retrieving transaction receipt:", error);
  }
}

export const getContractDeploymentTime = async (contractHash, provider) => {
  const blockNumber = await getBlockNumberFromTxHash(contractHash, provider);
  const block = await provider.getBlock(blockNumber);

  return block.timestamp;
};


export async function getTransactionTimestamp(txHash, provider) {
  try {
    // Get the transaction receipt
    const receipt = await provider.getTransactionReceipt(txHash);
    
    // Get the block that included this transaction
    const block = await provider.getBlock(receipt.blockNumber);
    
    // The timestamp is in seconds; convert to milliseconds for a Date object
    const transactionDate = new Date(block.timestamp * 1000);
    
    console.log(`Transaction was mined at: ${transactionDate.toLocaleString()}`);
    return transactionDate;
  } catch (error) {
    console.error("Error fetching transaction timestamp:", error);
    return null;
  }
}

export async function approve(escrowContract, signer) {
  try {
      const approveTxn = await escrowContract.connect(signer).approve({ gasLimit: 100000 });
      console.log('Approval transaction sent:', approveTxn.hash);

      await approveTxn.wait();
      console.log('Approval transaction confirmed');
  }
  catch (error) {
      console.error('Error approving escrow:', error);

      if (error.error && error.error.message) {
          console.error('Detailed error:', error.error.message);
      }
      throw error;
  }
}

export async function handleApprove(arbiter, account, address, escrowContract, signer)
{
  try {
    if (arbiter !== account)
    {
      alert("Only Arbiter can approve the transfer");
      return;
    }

    escrowContract.on('Approved', () => {
      document.getElementById(address).className =
        'complete';
      document.getElementById(address).innerText =
        "✓ It's been approved!";
    });

    await approve(escrowContract, signer);
  }
  catch {
    alert('Transaction failed!');
  }
}

export async function fetchApprovalTimestamp(contractAddress, provider) {
  const contract = new ethers.Contract(contractAddress, Escrow.abi, provider);

  const filter = contract.filters.ContractApproved();
  const logs = await contract.queryFilter(filter);

  if (logs.length > 0) {
      const approvalEvent = logs[logs.length - 1]; // Get the last approval event
      const approvalTimestampBN = approvalEvent.args.timestamp;

      // Convert the BigNumber to a number and then to a JavaScript Date
      // const approvalTimestamp = new Date(approvalTimestampBN.toNumber() * 1000).toUTCString(); // Multiply by 1000 to convert to milliseconds

      const approvalTimestamp = approvalTimestampBN.toNumber()

      return approvalTimestamp;
  }

  return null;
}
