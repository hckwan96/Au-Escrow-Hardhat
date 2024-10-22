import { useNavigate, useParams } from 'react-router-dom';
import CSSClass from '../accountDetails.module.css';
import { useRouteLoaderData } from "react-router-dom";
import { formatAddress,
    formatTimestamp, 
    fetchApprovalTimestamp } from '../tools/common';
import { ethers } from 'ethers';
import { fetchContract } from '../tools/storage';
import { Card, Row } from 'react-bootstrap';
import listDeployedContracts from '../components/listDeployedContracts';

const AccountDetails = ({ isConnected }) => {
    const { address: account } = useParams();
    const data = useRouteLoaderData('account');
    const navigate = useNavigate();

    let row = 0;

    if (!isConnected) {
        return (
            <Card className="card existing-contracts text-center">
                <Card.Header>
                    <h1>Account Info</h1>
                </Card.Header>
                <Card.Body>
                    <p>You are logged out. Please connect to MetaMask to view account details.</p>
                </Card.Body>
            </Card>
        );
    }

    return (
        <Card className="card existing-contracts text-center">
            <Card.Header>
                <h1>Account Info</h1>
            </Card.Header>
            <Card.Body>
                <div className={CSSClass.accountMain}>
                    <Row>
                        <div className={CSSClass.accountAddress}>
                            <span style={{ fontWeight: 'bold' }}>Account: </span>
                            <span>{formatAddress(account)}</span>
                        </div>
                    </Row>

                    {/* Own Contracts */}
                    <div className={CSSClass.accountContract}>
                        <div className={CSSClass.accountContractTitle}>Own Contracts:</div>
                        {data && data.ownerContract && data.ownerContract.length === 0 && <p>No contracts created yet.</p>}
                        {data && data.ownerContract && data.ownerContract.length > 0 && (
                            <div className={CSSClass.accountContractList}>
                                {data.ownerContract.map((info, idx) => {
                                    row++;
                                    return (
                                        <div
                                            className={CSSClass.listItem}
                                            key={`e_a_${idx}`}
                                            onClick={() => navigate(`/escrow/${info.address}`)}
                                        >
                                            <div className={CSSClass.listItemValueBorder}>{formatTimestamp(info.timestamp)}</div>
                                            <div className={`${CSSClass.listItemValueBorder} ${CSSClass.listItemAddress}`}>
                                                {formatAddress(info.address)}
                                            </div>
                                            <div className={CSSClass.listItemValueBorder}>{info.value} ETH</div>
                                            <div className={CSSClass.listItemValue}>
                                                {
                                                    info.isApproved 
                                                        ? `Approved (on ${formatTimestamp(info.approveTimestamp)})` 
                                                        : 'Not yet approved'
                                                }
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Arbiter Contracts */}
                    <div className={CSSClass.accountContract}>
                        <div className={CSSClass.accountContractTitle}>Arbiter Contracts:</div>
                        {data && data.arbiterContract && data.arbiterContract.length === 0 && (
                            <p>No contracts where you're the arbiter yet.</p>
                        )}
                        {data && data.arbiterContract && data.arbiterContract.length > 0 && (
                            <div className={CSSClass.accountContractList}>
                                {data.arbiterContract.map((info, idx) => {
                                    row++;
                                    return (
                                        <div
                                            className={CSSClass.listItem}
                                            key={`e_a_${idx + row}`}
                                            onClick={() => navigate(`/escrow/${info.address}`)}
                                        >
                                            <div className={CSSClass.listItemValueBorder}>{formatTimestamp(info.timestamp)}</div>
                                            <div className={`${CSSClass.listItemValueBorder} ${CSSClass.listItemAddress}`}>
                                                {formatAddress(info.address)}
                                            </div>
                                            <div className={CSSClass.listItemValueBorder}>{info.value} ETH</div>
                                            <div className={CSSClass.listItemValue}>
                                                {
                                                    info.isApproved 
                                                        ? `Approved (on ${formatTimestamp(info.approveTimestamp)})` 
                                                        : 'Not yet approved'
                                                }
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Beneficiary Contracts */}
                    <div className={CSSClass.accountContract}>
                        <div className={CSSClass.accountContractTitle}>Beneficiary Contracts:</div>
                        {data && data.beneficiaryContract && data.beneficiaryContract.length === 0 && (
                            <p>No contracts where you're the beneficiary yet.</p>
                        )}
                        {data && data.beneficiaryContract && data.beneficiaryContract.length > 0 && (
                            <div className={CSSClass.accountContractList}>
                                {
                                    data.beneficiaryContract.map((info, idx) => (
                                        <div
                                            className={CSSClass.listItem}
                                            key={`e_a_${idx + row}`}
                                            onClick={() => navigate(`/escrow/${info.address}`)}
                                        >
                                            <div className={CSSClass.listItemValueBorder}>{formatTimestamp(info.timestamp)}</div>
                                            <div className={`${CSSClass.listItemValueBorder} ${CSSClass.listItemAddress}`}>
                                                {formatAddress(info.address)}
                                            </div>
                                            <div className={CSSClass.listItemValueBorder}>{info.value} ETH</div>
                                            <div className={CSSClass.listItemValue}>
                                                {
                                                    info.isApproved 
                                                        ? `Approved (on ${info.approveTimestamp})` 
                                                        : 'Not yet approved'
                                                }
                                            </div>
                                        </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export const loaderAccount = async ({ params }) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
  
    let arbiterContract = [];
    let beneficiaryContract = [];
    let ownerContract = [];
  
    // Fetch contracts associated with the account
    const deployedAddresses = await fetchContract(await signer.getAddress());
  
    if (deployedAddresses && deployedAddresses.length > 0) {
      for (let index in deployedAddresses) {
        const escrow = await listDeployedContracts(deployedAddresses[index], signer, provider, params.address);

        const approveTimestamp = await fetchApprovalTimestamp(escrow.address, provider);
        escrow["approveTimestamp"] = approveTimestamp;
  
        if (params.address === escrow.depositor) {
          ownerContract.push(escrow);
        } else if (params.address === escrow.arbiter) {
          arbiterContract.push(escrow);
        } else if (params.address === escrow.beneficiary) {
          beneficiaryContract.push(escrow);
        }
      }
    }

    return { ownerContract, arbiterContract, beneficiaryContract };
};

export default AccountDetails;