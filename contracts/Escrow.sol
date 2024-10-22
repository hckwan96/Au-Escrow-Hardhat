// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Escrow {
	address public arbiter;
	address public beneficiary;
	address public depositor;

	bool public isApproved;
	uint256 public lockedValue;

	constructor(address _arbiter, address _beneficiary) payable
	{
		arbiter = _arbiter;
		beneficiary = _beneficiary;
		depositor = msg.sender;
		lockedValue = address(this).balance;
	}

	event Approved(uint);
	event ContractApproved(address indexed approver, uint256 timestamp);

	function approve() external
	{
		require(msg.sender == arbiter, "No Arbiter");
		uint balance = address(this).balance;
		(bool sent, ) = payable(beneficiary).call{value: balance}("");
 		require(sent, "Failed to send Ether");
		emit Approved(balance);
		emit ContractApproved(msg.sender, block.timestamp); // Emit approval event with the timestamp
		isApproved = true;
	}
}
