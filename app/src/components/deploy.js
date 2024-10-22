
/// deploy to local

import { ethers } from 'ethers';
import Escrow from '../artifacts/contracts/Escrow.sol/Escrow.json';

export default async function deploy(signer, arbiter, beneficiary, value) {
  try {
    const factory = new ethers.ContractFactory(
      Escrow.abi,
      Escrow.bytecode,
      signer
    );

    const escrowContract = await factory.deploy(arbiter, beneficiary, { value });
    await escrowContract.deployed();

    const txHash = escrowContract.deployTransaction.hash;
    return {escrowContract, txHash};
  }
  catch (err)
  {
    console.error(`Error in deploying contract:`, err);
    alert(err);
    throw err;
  }
}



/// deploy to sepolia
// const { ethers } = require('ethers');
// const Escrow = require('./artifacts/contracts/Escrow.sol/Escrow.json'); 

// async function deploy(signer, arbiter, beneficiary, value) {
//   try {
//     const factory = new ethers.ContractFactory(
//       Escrow.abi,
//       Escrow.bytecode,
//       signer
//     );

//     console.log("Deploying contract...");

//     // Deploy the contract
//     const contract = await factory.deploy(arbiter, beneficiary, { value });

//     console.log(`Transaction Hash: ${contract.deployTransaction.hash}`);
    
//     // Wait for the deployment to be mined
//     await contract.deployed();

//     console.log(`Contract deployed at address: ${contract.address}`);
    
//     return contract;
//   } catch (error) {
//     console.error("Error deploying contract:", error);
//   }
// }

// async function main() {
//   // Initialize the provider directly from the Alchemy URL
//   const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_KEY); 

//   // Create a wallet instance with the private key
//   const wallet = new ethers.Wallet(process.env.TESTNET_PRIVATEKEY, provider); 
//   const arbiter = "0x28d2dAA73140d97173F6550A9cBA5c60bDaf229A"; 
//   const beneficiary = "0x62cE4854850c21182d9Fdb7918D5B0018F15e140"; 
//   const value = ethers.utils.parseEther("0.01"); 

//   await deploy(wallet, arbiter, beneficiary, value);
// }

// main()
//   .then(() => process.exit(0))
//   .catch(error => {
//     console.error(error);
//     process.exit(1);
// });