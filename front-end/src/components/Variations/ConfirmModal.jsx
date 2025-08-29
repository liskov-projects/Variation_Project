const ConfirmModal = ({ setShowConfirmModal, handleSendVariationForSignature, isSubmitting, recipientDetails}) => {
    return (
        <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
            tabIndex="-1"
            role="dialog"
        >
            <div className="modal-dialog" style={{marginTop: "20vh"}} role="document">
            <div className="modal-content">
                <div className="modal-header">
                <h5 className="modal-title">Send Variation To {recipientDetails.type}{recipientDetails.permitRequired && ' and Surveyor'} For Approval?</h5>
                <button type="button" className="btn-close" onClick={() => setShowConfirmModal(false)}></button>
                </div>
                <div className="modal-body">
                <p>This variation requires sign off from the {recipientDetails.type.toLowerCase()}{recipientDetails.permitRequired && ' and surveyor'}.</p>
                <p>Once you send this variation for approval it <em>cannot</em> be edited.</p>
                <p>If you agree to send, it will be sent to {recipientDetails.name} at {recipientDetails.email}{recipientDetails.permitRequired && ` and ${recipientDetails.surveyorDetails.name} at ${recipientDetails.surveyorDetails.email}`}.</p>
                <p>Please choose 'Review Details' if you'd like to make changes or 'Send Variation' if you're certain all the details are correct.</p>
                </div>
                <div className="d-flex justify-content-between p-3">
                <button type="button" className="btn btn-secondary" onClick={() => setShowConfirmModal(false)}>
                    Review Details
                </button>
                <button
                    type="button"
                    className="btn btn-success"
                    onClick={async () => {
                    setShowConfirmModal(false);
                    await handleSendVariationForSignature();
                    }}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                    <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Sending...
                    </>
                    ) : (
                    "Send For Approval"
                    )}
                </button>
                </div>
            </div>
            </div>
        </div>
)}

export default ConfirmModal;

