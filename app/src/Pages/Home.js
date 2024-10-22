import React from 'react';
// import { useState } from 'react';
import deploy from '../components/deploy';
import { Card, Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { weiToEth } from '../tools/converter';
import createEscrow from '../components/EscrowCreation';
import { persistStorage } from '../tools/storage';

function Home({ isConnected, account, signer }) {
  async function newContract(e) {
    try {
      const beneficiary = document.getElementById('beneficiary').value;
      const arbiter = document.getElementById('arbiter').value;
      let value = document.getElementById('wei').value;

      if (!beneficiary && !arbiter && !value )
      {
        alert("All fields are required!")
        return;
      }

      value = weiToEth(value);
      const { escrowContract, txHash } = await deploy(signer, arbiter, beneficiary, value);

      console.log('Waiting for contract deployment to be mined...');
      const receipt = await escrowContract.deployTransaction.wait();
      console.log('Contract deployed in block', receipt.blockNumber);
      
      const escrow = createEscrow(escrowContract.address, arbiter, beneficiary, value, escrowContract, signer, false, account, e);
    
      await persistStorage(await signer.getAddress(), escrow.address, arbiter, txHash);
    }
    catch (err) {
      console.error(`Transaction:`, err);
      alert(err);
      throw err;
    }
  }
  
  return (
    <React.Fragment>
      <Card className="card contract text-center">
        <Card.Header>
          <h1>Create New Contract</h1>
        </Card.Header>

        <Card.Body>
          <Row>
            <Col>
              <h6>Arbiter Address</h6>
              <input type="text" id="arbiter" />
            </Col>
            <Col>
              <h6>Beneficiary Address</h6>
              <input type="text" id="beneficiary" />
            </Col>
            <Col>
              <h6>Deposit Amount (in Eth)</h6>
              <input type="text" id="wei" />
            </Col>
          </Row>
        </Card.Body>

        <Button variant="primary" size='sm'
          id="deploy"
          onClick={(e) => {
            e.preventDefault();

            if (isConnected)
              newContract(e);
            else
              alert("Please connect to the Metamask Wallet")
          }}
        >
          Deploy
        </Button>
      </Card>
    </React.Fragment>
  );
}

export default Home;