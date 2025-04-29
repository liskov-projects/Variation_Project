import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import API_BASE_URL from '../api';

const SignaturePage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [project, setProject] = useState(null);
    const [variation, setVariation] = useState(null);
    const [error, setError] = useState(null);
    const [clientName, setClientName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
        const fetchVariation = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/api/projects/variations/validate-token?token=${token}`);
                setProject(response.data.project);
                setVariation(response.data.variation);
                setLoading(false);
            } catch (error) {
                setError(error.response?.data?.message || 'Invalid or expired token');
                setLoading(false);
            }
        }
        if (token) {
            fetchVariation();
        } else {
            setError('No token provided');
            setLoading(false);
        }
    }, [token]);

    const handleSubmitSignature = async (e) => {
        e.preventDefault();
        if (!clientName.trim()) {
            setError('Please enter your name to sign this variation');
            return;
        }
        try {
            setIsSubmitting(true);
            const response = await axios.post(`${API_BASE_URL}/api/projects/variations/sign`, {
                token,
                signedBy: {
                    name: clientName,
                    userAgent: navigator.userAgent,
                }
            });
            
            setSuccessMessage('Variation successfully signed! Thank you.');
            setIsSubmitting(false);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to submit signature');
            setIsSubmitting(false);
        }
    }

        if (loading) {
            return (
              <div className="container py-5">
                <div className="d-flex justify-content-center align-items-center vh-50">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              </div>
            );
          }
          if (error) {
            return (
              <div className="container py-5">
                <div className="alert alert-danger">
                  <h4 className="alert-heading">Error</h4>
                  <p>{error}</p>
                </div>
              </div>
            );
          }
          if (successMessage) {
            return (
              <div className="container py-5">
                <div className="alert alert-success">
                  <h4 className="alert-heading">Success!</h4>
                  <p>{successMessage}</p>
                </div>
              </div>
            );
          }
          if (!variation || !project) {
            return (
              <div className="container py-5">
                <div className="alert alert-warning">
                  <h4 className="alert-heading">Not Found</h4>
                  <p>The requested variation could not be found or has expired.</p>
                </div>
              </div>
            );
          }

        // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

    if (error) {
        return <div>Error: {error}</div>;
      }
    
      if (!variation) {
        return <div>Loading...</div>;
      }
    //   Should change variation.description
      return (
        <div className="container py-5">
        <div className="card border-0 shadow">
            <div className="card-header bg-primary text-white">
                <h2 className="mb-0">Project Variation Approval</h2>
            </div>
            <div className="card-body">
            <div className="alert alert-info mb-4">
                <div className="row">
                <div className="col-md-6">
                    <strong>Project:</strong> {project.projectName}
                </div>
                <div className="col-md-6">
                    <strong>Property Address:</strong> {project.propertyAddress}
                </div>
                </div>
            </div>
            <h4>Variation Details</h4>
            <div className="card mb-4">
                <div className="card-body">
                <div className="row mb-3">
                    <div className="col-md-12">
                    <h5>Description</h5>
                    <p>{variation.description}</p>
                    </div>
                </div>
                <div className="row mb-3">
                <div className="col-md-6">
                  <h5>Reason for Variation</h5>
                  <p>{variation.reason}</p>
                </div>
                <div className="col-md-6">
                  <h5>Effect on Project</h5>
                  <p>{variation.effect}</p>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <h5>Permit Required</h5>
                  <p>{variation.permitVariation}</p>
                </div>
                <div className="col-md-6">
                  <h5>Timeline Delay</h5>
                  <p>{variation.delay}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <div className="card bg-light">
                    <div className="card-body text-center">
                      <h5 className="card-title">Variation Cost</h5>
                      <p className="display-6">{formatCurrency(variation.cost)}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="card bg-light">
                    <div className="card-body text-center">
                      <h5 className="card-title">New Contract Price</h5>
                      <p className="display-5">{formatCurrency(variation.newContractPrice)}</p>
                      <small className="text-muted">
                        Updated total contract value after this variation is applied
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmitSignature}>
            <div className="mb-4">
              <h4>Signature</h4>
              <p className="text-muted">
                By signing below, you acknowledge that you have read and accept this variation to your project contract.
              </p>
            </div>
            <div className="mb-3">
              <label htmlFor="clientName" className="form-label">Full Name (as signature)</label>
              <input
                type="text"
                className="form-control"
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
              <div className="form-text">
                Your name will be recorded as your electronic signature.
              </div>
            </div>
            <div className="d-grid gap-2">
              <button 
                type="submit" 
                className="btn btn-primary btn-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Processing...
                  </>
                ) : (
                  'Sign and Approve Variation'
                )}
              </button>
              </div>
          </form>
        </div>
        <div className="card-footer bg-light">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <small className="text-muted">Submitted on: {formatDate(variation.dateCreated)}</small>
            </div>
            <div>
              <small className="text-muted">Link expires in 24 hours from receipt</small>
            </div>
          </div>
        </div>
      </div>
    </div>
      );
}

export default SignaturePage;