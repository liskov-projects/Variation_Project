import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFormStorage from '../../hooks/useFormStorage';

const StepTwo = () => {
    const navigate = useNavigate();
    const { formData, updateFormData, setCurrentStep } = useFormStorage();
    const [partners, setPartners] = useState([]);

    useEffect(() => {
        setCurrentStep(2);
    }, [setCurrentStep]);

    // Initialize partners from form data if available
    useEffect(() => {
        if (formData.partnership === 'Yes' && formData.numberOfPartners) {
            // If we already have partners in formData, use them
            if (formData.partners && formData.partners.length > 0) {
                setPartners(formData.partners);
            } else {
                // Otherwise create empty partners based on numberOfPartners
                const initialPartners = Array.from(
                    { length: parseInt(formData.numberOfPartners) },
                    () => ({ name: '', address: '' })
                );
                setPartners(initialPartners);
                updateFormData({ partners: initialPartners });
            }
        }
    }, [formData.partnership, formData.numberOfPartners, formData.partners, updateFormData]);

    const handlePartnerChange = (index, field, value) => {
        const updatedPartners = partners.map((partner, i) =>
            i === index ? { ...partner, [field]: value } : partner
        );
        setPartners(updatedPartners);
        updateFormData({ partners: updatedPartners });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setCurrentStep(3);
        navigate('/step3');
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4">Company and Partnership Information</h2>
            <form onSubmit={handleSubmit}>
                {/* Company details */}
                <div className="mb-3">
                    <label className="form-label">Company Y/N *</label>
                    <div>
                        <div className="form-check form-check-inline">
                            <input
                                type="radio"
                                id="companyYes"
                                className="form-check-input"
                                value="Yes"
                                checked={formData.company === 'Yes'}
                                onChange={(e) => updateFormData({ company: e.target.value })}
                                required
                            />
                            <label className="form-check-label" htmlFor="companyYes">Yes</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input
                                type="radio"
                                id="companyNo"
                                className="form-check-input"
                                value="No"
                                checked={formData.company === 'No'}
                                onChange={(e) => updateFormData({ company: e.target.value })}
                                required
                            />
                            <label className="form-check-label" htmlFor="companyNo">No</label>
                        </div>
                    </div>
                </div>

                {/* Show company name field if company is Yes */}
                {formData.company === 'Yes' && (
                    <div className="mb-3">
                        <label className="form-label">Company Name *</label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.companyName || ''}
                            onChange={(e) => updateFormData({ companyName: e.target.value })}
                            required
                        />
                    </div>
                )}

                {/* Partnership details */}
                <div className="mb-3">
                    <label className="form-label">Partnership Y/N *</label>
                    <div>
                        <div className="form-check form-check-inline">
                            <input
                                type="radio"
                                id="partnershipYes"
                                className="form-check-input"
                                value="Yes"
                                checked={formData.partnership === 'Yes'}
                                onChange={(e) => updateFormData({ partnership: e.target.value })}
                                required
                            />
                            <label className="form-check-label" htmlFor="partnershipYes">Yes</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input
                                type="radio"
                                id="partnershipNo"
                                className="form-check-input"
                                value="No"
                                checked={formData.partnership === 'No'}
                                onChange={(e) => updateFormData({ partnership: e.target.value })}
                                required
                            />
                            <label className="form-check-label" htmlFor="partnershipNo">No</label>
                        </div>
                    </div>
                </div>

                {/* When partnership is Yes, show additional fields */}
                {formData.partnership === 'Yes' && (
                    <div className="mb-3">
                        <label className="form-label">Number of Partners *</label>
                        <input
                            type="number"
                            className="form-control"
                            value={formData.numberOfPartners || ''}
                            onChange={(e) => updateFormData({ numberOfPartners: e.target.value })}
                            min="1"
                            required
                        />
                        
                        {/* Partner inputs */}
                        {partners.map((partner, index) => (
                            <div key={index} className="card mb-3 mt-3 p-3 bg-light">
                                <h5>Partner {index + 1}</h5>
                                <div className="mb-3">
                                    <label className="form-label">Name *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={partner.name || ''}
                                        onChange={(e) => handlePartnerChange(index, 'name', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Address *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={partner.address || ''}
                                        onChange={(e) => handlePartnerChange(index, 'address', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="d-flex justify-content-between mt-4">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate('/step1')}
                    >
                        Previous
                    </button>
                    <button type="submit" className="btn btn-primary">
                        Next
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StepTwo;