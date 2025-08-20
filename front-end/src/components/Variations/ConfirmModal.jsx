const ConfirmModal = ({ setShowConfirmModal, handleSendVariationForSignature, isSubmitting}) => {
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
                <h5 className="modal-title">Send Variation For Approval?</h5>
                <button type="button" className="btn-close" onClick={() => setShowConfirmModal(false)}></button>
                </div>
                <div className="modal-body">
                <p>Once you send this variation for approval, it cannot be edited.</p>
                <p>Please choose 'Review Details' if you'd like to make changes or 'Send Variation' if you're certain all the details are correct.</p>
                </div>
                <div className="modal-footer">
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
                    "Send Variation For Approval"
                    )}
                </button>
                </div>
            </div>
            </div>
        </div>
)}

export default ConfirmModal;

