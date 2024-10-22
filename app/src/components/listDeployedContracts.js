import { ethers } from 'ethers';
import Escrow from '../artifacts/contracts/Escrow.sol/Escrow.json';
import createEscrow from './EscrowCreation';
import { getContractDeploymentTime } from '../tools/common';
import { fetchContractHash } from '../tools/storage'

export default async function listDeployedContracts(address, signer, provider, account) {
  // Check if the address is a valid Ethereum address
  if (!ethers.utils.isAddress(address)) {
    console.error(`Invalid address: ${address}`);
    return null;
  }
  
  const escrowContract = new ethers.Contract(address, Escrow.abi, signer);
  const contractHash = await fetchContractHash(address);
  const timestamp = await getContractDeploymentTime(contractHash[0], provider);

  try {
    const isApproved = await escrowContract.isApproved(); 
    const arbiter = await escrowContract.arbiter();
    const beneficiary = await escrowContract.beneficiary();
    const depositor = await escrowContract.depositor();
    const value = isApproved
      ? await escrowContract.lockedValue()
      : await provider.getBalance(escrowContract.address);

    return createEscrow(
      escrowContract.address,
      arbiter.toLowerCase(),
      beneficiary.toLowerCase(),
      value,
      escrowContract,
      signer,
      isApproved,
      depositor.toLowerCase(), 
      account,
      timestamp
    );
  }
  catch (error) {
    if (error.code === 'CALL_EXCEPTION') {
      console.warn(`Contract not deployed at address ${address}. Returning null.`);
      console.log(error)
      return null; // Return null if the contract is not deployed
    }
    else if (error.code === 'UNSUPPORTED_OPERATION') {
      console.warn(`ENS is not supported on this network. Proceeding without ENS.`);
    }
    else {
      console.error(`Error in listDeployedContract for address ${address}:`, error);
    }
    
    return null; // Return null for any other errors
  }
}
