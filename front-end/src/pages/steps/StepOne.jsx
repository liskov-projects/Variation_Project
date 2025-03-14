import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useFormStorage from '../../hooks/useFormStorage';

const StepOne = () => {
  const navigate = useNavigate();
  const { formData, updateFormData, setCurrentStep } = useFormStorage();

  useEffect(() => {
    setCurrentStep(1);
  }, [setCurrentStep]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentStep(2);
    navigate('/step2');
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Builder Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Builder Name *</label>
          <input
            type="text"
            className="form-control"
            value={formData.fullName || ''}
            onChange={(e) => updateFormData({ fullName: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Address *</label>
          <input
            type="text"
            className="form-control"
            value={formData.address || ''}
            onChange={(e) => updateFormData({ address: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email *</label>
          <input
            type="email"
            className="form-control"
            value={formData.email || ''}
            onChange={(e) => updateFormData({ email: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Telephone/Mobile Number *</label>
          <input
            type="tel"
            className="form-control"
            value={formData.phonenumber || ''}
            onChange={(e) => updateFormData({ phonenumber: e.target.value })}
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

export default StepOne;