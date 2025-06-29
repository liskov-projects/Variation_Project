import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../contexts/ProfileContext";
import StepOne from "../components/ProfileSteps/StepOne";
import StepTwo from "../components/ProfileSteps/StepTwo";
import StepReview from "../components/ProfileSteps/StepReview";
import FormProgress from "../components/FormProgress";
import Header from "../components/Header/index";
import validateStep from "../utils/stepsValidator";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [formError, setFormError] = useState(null);
  const [isCompleted, setIsCompleted] = useState([false, false, false, false]);
  const {
    currentStep,
    setCurrentStep,
    saveProfile,
    loading,
    isProfileComplete,
    profileData,
  } = useProfile();

  // Redirect if profile is already complete
  useEffect(() => {
    if (isProfileComplete) {
      navigate("/dashboard");
    }
  }, [isProfileComplete]);

  // Render appropriate step component
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne />;
      case 2:
        return <StepTwo />;
      case 3:
        return <StepReview />;

      default:
        return <StepOne />;
    }
  };

  // helper function: used in multiple places
  const changeCompletedState = (step, value) => {
    setIsCompleted((prev) => {
      const updated = [...prev];
      updated[step - 1] = value;
      return updated;
    });
  };

  const handleNext = async () => {
    const validationError = validateStep(currentStep, profileData);
    if (validationError) {
      setFormError(validationError);
      changeCompletedState(currentStep, false);

      console.log(formError);
      return;
    } else {
      // helper function
      changeCompletedState(currentStep, true);
    }

    setFormError(null); // Clear any previous errors

    if (currentStep < 3) {
      // For steps 1-3, just save progress and move to next step
      // await saveProfile(false);
      setCurrentStep(currentStep + 1);
    } else {
      // For final step (review), mark profile as complete and redirect
      const result = await saveProfile(true);
      if (result.success) {
        navigate("/profile-complete");
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
    setFormError(null); // Clear any previous errors
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div
            className="spinner-border text-primary"
            role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="d-flex">
        <FormProgress
          isCompleted={isCompleted}
          changeCompletedState={changeCompletedState}
        />
        <div className="flex-grow-1 p-4">
          {formError && <div className="alert alert-danger">{formError}</div>}

          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">Profile Setup</h3>
            </div>
            <div className="card-body">
              {renderStep()}

              <div className="d-flex justify-content-between mt-4">
                {currentStep > 1 && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handlePrevious}>
                    Previous
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-primary ms-auto"
                  onClick={handleNext}
                  disabled={loading}>
                  {loading ? "Processing..." : currentStep < 3 ? "Next" : "Complete Profile"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
