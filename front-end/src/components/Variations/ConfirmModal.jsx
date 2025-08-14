const ConfirmModal = ({ setShowConfirmModal, handleSendVariationForSignature, isSubmitting}) => {
    return (
        <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
            tabIndex="-1"
            role="dialog"
        >
            <div className="modal-dialog" role="document">
            <div className="modal-content">
                <div className="modal-header">
                <h5 className="modal-title">Confirm Submission</h5>
                <button type="button" className="btn-close" onClick={() => setShowConfirmModal(false)}></button>
                </div>
                <div className="modal-body">
                <p>Once you send this variation for approval, it cannot be edited. Are you sure you want to continue?</p>
                </div>
                <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowConfirmModal(false)}>
                    Cancel
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
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
                    "Yes, Send for Approval"
                    )}
                </button>
                </div>
            </div>
            </div>
        </div>
)}

export default ConfirmModal;

