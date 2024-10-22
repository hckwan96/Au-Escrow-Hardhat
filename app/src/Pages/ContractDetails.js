// import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useRouteLoaderData } from "react-router-dom";
import { formatAddress, 
    formatTimestamp, 
    approve, 
    fetchApprovalTimestamp } from '../tools/common';
import { ethers } from 'ethers';
import { Card  } from 'react-bootstrap';
import listDeployedContracts from '../components/listDeployedContracts'
import Escrow from '../artifacts/contracts/Escrow.sol/Escrow.json';

const handleApprove = async (escrowContract, signer, address, e) => {
    try {
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

const ContractDetails = ({signer, isConnected}) => {
    // const { address: escrow } = useParams();
    const data = useRouteLoaderData('escrow');
    const [approvedTimestamp, setApprovedTimestamp] = useState(null);

    useEffect(() => {
        const fetchTimestamp = async () => {
            if (data.escrow.isApproved) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const timestamp = await fetchApprovalTimestamp(data.escrow.address, provider);
                setApprovedTimestamp(timestamp);
            }
        };

        fetchTimestamp();
    }, [data.escrow]);

    if (!isConnected) {
        return (
            <Card className="card existing-contracts text-center">
                <Card.Header>
                    <h1>Account Info</h1>
                </Card.Header>
                <Card.Body>
                    <p>You are logged out. Please connect to MetaMask to view contract details.</p>
                </Card.Body>
            </Card>
        );
    }

    return (
        <Card className="card existing-contracts text-center">
            <Card.Header>
                <h1>Contract Info</h1>
            </Card.Header>
            <Card.Body>
            <div className="existing-contract">
                <ul className="fields">
                    <li>
                        <div className="field-label">Contract Address</div>
                        <div className="field-value">
                            {formatAddress(data.escrow.address)}
                        </div>
                    </li>
                    <li>
                        <div className="field-label">
                            Created on
                        </div>
                        <div className="field-value">
                            {formatTimestamp(data.escrow.timestamp)}
                        </div>
                    </li>
                    <li>
                        <div className={ 
                            data.escrow.depositor === data.escrow.account.toLowerCase()
                                ? "highlight field-label"
                                : "field-label"}>
                            Owner/Signer
                        </div>
                        <div className={
                            data.escrow.depositor === data.escrow.account.toLowerCase()
                                ? "highlight field-value"
                                : "field-value"}>
                            {formatAddress(data.escrow.depositor)}
                        </div>
                    </li>
                    <li>
                        <div className={
                            data.escrow.arbiter === data.escrow.account.toLowerCase()
                                ? "highlight field-label"
                                : "field-label"}>
                            Arbiter
                        </div>
                        <div className={
                            data.escrow.arbiter === data.escrow.account.toLowerCase()
                                ? "highlight field-value"
                                : "field-value"}>
                            {formatAddress(data.escrow.arbiter)}
                        </div>
                    </li>
                    <li>
                        <div className={
                            data.escrow.beneficiary === data.escrow.account.toLowerCase()
                                ? "highlight field-label"
                                : "field-label"}>
                            Beneficiary
                        </div>
                        <div className="field-value">
                            {formatAddress(data.escrow.beneficiary)}
                        </div>
                    </li>
                    <li>
                        <div className="field-label">Value</div>
                        <div className="field-value">{data.escrow.value} ETH</div>
                    </li>
                    {
                        data.escrow.isApproved && approvedTimestamp && (
                            <li>
                                <div className="field-label">Approved On</div>
                                <div className="field-value">{formatTimestamp(approvedTimestamp)}</div>
                            </li>
                        )
                    }
                    <li className="approval-container">
                        {
                            data.escrow.isApproved 
                                ? (<div className="complete">✓ It's been approved!</div>)
                                : data.escrow.arbiter === data.escrow.account.toLowerCase()
                                    ? (
                                        (() => {
                                            const escrowContract = new ethers.Contract(data.escrow.address, Escrow.abi, signer);

                                            return (
                                                <div
                                                    className="button"
                                                    id={data.escrow.address}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleApprove(escrowContract, signer, data.escrow.address);
                                                    }}
                                                >
                                                    Approve
                                                </div>
                                            )
                                        })()
                                    )
                                    : <div className="not-approve">Arbiter not approved the contract yet</div>
                        }
                    </li>
                    </ul>
                </div>
            </Card.Body>
        </Card>
    );
};

export const loaderContract = async({params}) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const account = await signer.getAddress();
    const escrow = await listDeployedContracts(params.address, signer, provider, account);

    return { escrow }
}

export default ContractDetails;