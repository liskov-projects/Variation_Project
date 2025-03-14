import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useFormStorage from '../../hooks/useFormStorage';

const StepThree = () => {
    const navigate = useNavigate();
    const { formData, updateFormData, setCurrentStep } = useFormStorage();

    useEffect(() => {
        setCurrentStep(3);
    }, [setCurrentStep]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate ACN has exactly 9 digits
        if (formData.acn && formData.acn.toString().length !== 9) {
            alert('ACN must be exactly 9 digits');
            return;
        }
        
        // Validate ABN has exactly 11 digits
        if (formData.abn && formData.abn.toString().length !== 11) {
            alert('ABN must be exactly 11 digits');
            return;
        }
        
        setCurrentStep(4);
        navigate('/step4');
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4">Individual (Default) Information</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">ACN (9 digits) *</label>
                    <input
                        type="number"
                        className="form-control"
                        value={formData.acn || ''}
                        onChange={(e) => updateFormData({ acn: e.target.value })}
                        required
                    />
                    <div className="form-text">Must be exactly 9 digits</div>
                </div>
                
                <div className="mb-3">
                    <label className="form-label">ABN (11 digits) *</label>
                    <input
                        type="number"
                        className="form-control"
                        value={formData.abn || ''}
                        onChange={(e) => updateFormData({ abn: e.target.value })}
                        required
                    />
                    <div className="form-text">Must be exactly 11 digits</div>
                </div>
                
                <div className="mb-3">
                    <label className="form-label">Builder Registration # *</label>
                    <input
                        type="text"
                        className="form-control"
                        value={formData.brn || ''}
                        onChange={(e) => updateFormData({ brn: e.target.value })}
                        required
                    />
                </div>

                <div className="d-flex justify-content-between mt-4">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate('/step2')}
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

export default StepThree;