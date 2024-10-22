export default function Escrow({
  address,
  arbiter,
  beneficiary,
  value,
  handleApprove,
  depositor,
  account,
  isApproved
}) {
  return (
    <div className="existing-contract">
      <ul className="fields">
        <li>
          <div className="field-label">Contract Address</div>
          <div className="field-value">{address}</div>
        </li>
        <li>
          <div className={
              depositor === account
                ? "highlight field-label"
                : "field-label"}>
            Owner/Signer
          </div>
          <div className={
              depositor === account
              ? "highlight field-value"
              : "field-value"}>
            {depositor}
          </div>
        </li>
        <li>
          <div className={
              arbiter === account
                ? "highlight field-label"
                : "field-label"}>
            Arbiter
          </div>
          <div className={
              arbiter === account
                ? "highlight field-value"
                : "field-value"}>
            {arbiter}
          </div>
        </li>
        <li>
        <div className={
              beneficiary === account
                ? "highlight field-label"
                : "field-label"}>
            Beneficiary
          </div>
          <div className={
              beneficiary === account
                ? "highlight field-value"
                : "field-value"}>
            {beneficiary}
          </div>
        </li>
        <li>
          <div className="field-label">Value</div>
          <div className="field-value">{value} ETH</div>
        </li>
        <li className="approval-container">
          {
            isApproved 
              ? (<div className="complete">✓ It's been approved!</div>)
              : arbiter === account ?
                  (<div
                    className="button"
                    id={address}
                    onClick={(e) => {
                      e.preventDefault();
                      
                      handleApprove()
                    }}
                  >
                    Approve
                  </div>)
                : <div className="not-approve">Arbiter not approve the contract yet</div>
            }
        </li>
      </ul>
    </div>
  );
}
