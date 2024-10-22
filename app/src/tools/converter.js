import { ethers } from 'ethers';

function ethToWei(value) {
    return ethers.utils.formatEther(value.toString());
}

function weiToEth(value) {
    return ethers.utils.parseUnits(value, "ether");
}

export { ethToWei, weiToEth }   