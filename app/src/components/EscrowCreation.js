import { ethToWei } from '../tools/converter';
import { approve } from '../tools/common'

export default function createEscrow(
    address,
    arbiter,
    beneficiary,
    value,
    escrowContract,
    signer, 
    isApproved,
    depositor,
    account,
    timestamp
  ) {
  return {
    address: address,
    arbiter: arbiter,
    beneficiary: beneficiary,
    value: ethToWei(value),
    isApproved: isApproved,
    depositor: depositor,
    account: account,
    timestamp: timestamp,
    handleApprove: async (e) => {
      try {
        if (arbiter !== account)
        {
          alert("Only Arbiter can approve the transfer");
          return;
        }

        escrowContract.on('Approved', () => {
          if (e) {
              e.currentTarget.disabled = true;
          }
          
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
  };    
}