import React, { useEffect, useState } from 'react';
import Escrow from '../components/Escrow';
import { fetchContract } from '../tools/storage';
import listDeployedContracts from '../components/listDeployedContracts';
import { Card } from 'react-bootstrap';

function ExistingContracts({ account, signer, provider, isConnected }) {
  const [escrows, setEscrows] = useState([]);

  useEffect(() => {
    const getEscrows = async () => {
      let mappedEscrows = [];
      const deployedAddresses = await fetchContract(await signer.getAddress());
    
      for (let index in deployedAddresses) {
        const escrow = await listDeployedContracts(deployedAddresses[index], signer, provider, account);
        mappedEscrows.push(escrow);
      }

      setEscrows(mappedEscrows);
    };

    getEscrows();
  }, [signer, account]);

  if (!isConnected) {
    return (
        <Card className="card existing-contracts text-center">
            <Card.Header>
                <h1>Account Info</h1>
            </Card.Header>
            <Card.Body>
                <p>You are logged out. Please connect to MetaMask to view existing contracts.</p>
            </Card.Body>
        </Card>
    );
  }

  return (
    <Card className="card existing-contracts text-center">
      <Card.Header>
        <h1>Existing Contracts</h1>
      </Card.Header>
      <div id="container1">
        {
          escrows
            .filter(escrow => escrow !== null)
            .map((escrow) => (
              escrow.arbiter === escrow.account ?
              (
                <>
                  <h3 style={{paddingTop: "20px"}}><hr /></h3>
                  <Escrow key={escrow.address} {...escrow} />
                </>
              )
              : null
            )).toReversed()
        }
      </div>
      <div id="container2">
        {
          escrows
            .filter(escrow => escrow !== null)
            .map((escrow) => (
              escrow.account === escrow.depositor ?
              (
                <>
                  <h3 style={{paddingTop: "20px"}}><hr /></h3>
                  <Escrow key={escrow.address} {...escrow} />
                </>
              )
              : null
            )).toReversed()
        }
      </div>
    </Card>
  );
}

export default ExistingContracts;