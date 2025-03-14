import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFormStorage from '../../hooks/useFormStorage';

const StepThree = () => {
    const navigate = useNavigate();
    const { formData, updateFormData, setCurrentStep } = useFormStorage();

    useEffect(() => {
        setCurrentStep(3);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setCurrentStep(4);
        navigate('/step4');
    };

    return (
        <div className="container py-4">
        <h2 className="mb-4">Individual Information</h2>
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
            <label className="form-label">ACN</label>
            <input
                type="number"
                className="form-control"
                value={formData.acn || ''}
                onChange={(e) => updateFormData({ acn: e.target.value })}
                required
            />
            
            </div>
            <div className="mb-3">
          <label className="form-label">ABN</label>
          <input
            type="number"
            className="form-control"
            value={formData.abn || ''}
            onChange={(e) => updateFormData({ abn: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Builder Registration Number</label>
          <input
            type="number"
            className="form-control"
            value={formData.brn || ''}
            onChange={(e) => updateFormData({ brn: e.target.value })}
            required
          />
        </div>
            <button type="submit" className="btn btn-primary float-end">
            Next
            </button>
        </form>
        </div>
    );
    };

export default StepThree;