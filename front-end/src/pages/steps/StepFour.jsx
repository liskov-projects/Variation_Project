import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useFormStorage from '../../hooks/useFormStorage';
import useFormSubmit from '../../hooks/useFormSubmit';
import { useAuth } from '@clerk/clerk-react';

const StepFour = () => {
  const navigate = useNavigate();
  const { formData, setCurrentStep } = useFormStorage();
  const { submitForm, loading, error, success } = useFormSubmit();
  const { userId, getToken } = useAuth();

  useEffect(() => {
    setCurrentStep(4);
  }, [setCurrentStep]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = await getToken();
      const email = formData.email;
      const res = await submitForm(userId, email, formData, token);
      setCurrentStep(5);
      navigate('/step5');
    }
    catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const renderPartnerInfo = () => {
    if (formData.partnership !== 'Yes' || !formData.partners) return null;
    
    return (
      <div className="mb-4">
        <h5 className="border-bottom pb-2">Partnership Details</h5>
        <div className="mb-3">
          <label className="form-label">Number of Partners</label>
          <p className="form-control bg-light">{formData.numberOfPartners}</p>
        </div>
        
        {formData.partners.map((partner, index) => (
          <div key={index} className="mb-3 card p-3 bg-light">
            <h6>Partner {index + 1}</h6>
            <div className="mb-2">
              <label className="form-label">Name</label>
              <p className="form-control bg-light">{partner.name}</p>
            </div>
            <div className="mb-2">
              <label className="form-label">Address</label>
              <p className="form-control bg-light">{partner.address}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Review Your Information</h2>
      <form onSubmit={handleSubmit}>
        {/* Personal Information */}
        <div className="mb-4">
          <h5 className="border-bottom pb-2">Builder Information</h5>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <p className="form-control bg-light">{formData.fullName}</p>
          </div>
          <div className="mb-3">
            <label className="form-label">Address</label>
            <p className="form-control bg-light">{formData.address}</p>
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <p className="form-control bg-light">{formData.email}</p>
          </div>
          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <p className="form-control bg-light">{formData.phonenumber}</p>
          </div>
        </div>

        {/* Company Information */}
        <div className="mb-4">
          <h5 className="border-bottom pb-2">Company Information</h5>
          <div className="mb-3">
            <label className="form-label">Company</label>
            <p className="form-control bg-light">{formData.company}</p>
          </div>
          {formData.company === 'Yes' && (
            <div className="mb-3">
              <label className="form-label">Company Name</label>
              <p className="form-control bg-light">{formData.companyName}</p>
            </div>
          )}
        </div>

        {/* Partnership Information */}
        <div className="mb-4">
          <h5 className="border-bottom pb-2">Partnership Status</h5>
          <div className="mb-3">
            <label className="form-label">Partnership</label>
            <p className="form-control bg-light">{formData.partnership}</p>
          </div>
        </div>

        {/* Render partner details if partnership is Yes */}
        {renderPartnerInfo()}

        {/* Individual Information */}
        <div className="mb-4">
          <h5 className="border-bottom pb-2">Individual Information</h5>
          <div className="mb-3">
            <label className="form-label">ACN</label>
            <p className="form-control bg-light">{formData.acn}</p>
          </div>
          <div className="mb-3">
            <label className="form-label">ABN</label>
            <p className="form-control bg-light">{formData.abn}</p>
          </div>
          <div className="mb-3">
            <label className="form-label">Builder Registration #</label>
            <p className="form-control bg-light">{formData.brn}</p>
          </div>
        </div>

        <div className="d-flex justify-content-between mt-4">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/step3')}
          >
            Previous
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>

        {error && <p className="text-danger mt-3">Error: {error.message}</p>}
        {success && <p className="text-success mt-3">Form submitted successfully!</p>}
      </form>
    </div>
  );
};

export default StepFour;