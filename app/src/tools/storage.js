import server from '../components/server';

async function persistStorage(signerAddress, contractAddress, arbiterAddress, txHash) {
  try {
    await server.post('add', {
      address: signerAddress,
      contract: contractAddress,
      arbiter: arbiterAddress,
      txHash: txHash
    });
  }
  catch (error) {
    if (error.response) {
      console.error("Error adding escrows:", JSON.stringify(error.response.data));
      throw new Error(JSON.stringify(error.response.data));  // Return meaningful error message
    }
    else {
      console.error("Error adding escrows:", error.message);
      throw new Error("Error adding escrows. Please try again.");
    }
  }
}


async function fetchContract(address) {
  try {
    const { data: { addresses } } = await server.post(`escrows`, { address });

    // If no escrows found, return an empty array instead of throwing an error
    if (!addresses || addresses.length === 0) {
      return [];
    }

    return addresses;
  }
  catch (error) {
    if (error.response) {
      if (error.response.data.error === "No escrows found for this address") {
        console.warn("No escrows found for the provided address.");
        return [];
      }

      console.error("Error fetching escrows:", JSON.stringify(error.response.data));
      throw new Error(JSON.stringify(error.response.data));
    }
    else {
      console.error("Error fetching escrows:", error.message);
      throw new Error("Error fetching escrows. Please try again.");
    }
  }
}

async function fetchContractHash(address) {
  try {
    const { data: { hash } } = await server.post(`hash`, {
      contract: address
    });

    return hash;
  }
  catch (error)
  {
    if (error.response) {
      console.error("Error fetching escrows:", error.response.data);
      throw new Error(error.response.data);
    }
    else {
      console.error("Error fetching escrows:", error.message);
      throw new Error("Error fetching escrows. Please try again.");
    }
  }
}

export { persistStorage, fetchContract, fetchContractHash }