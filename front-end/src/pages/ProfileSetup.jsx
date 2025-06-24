import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../contexts/ProfileContext";
import StepOne from "../components/ProfileSteps/StepOne";
import StepTwo from "../components/ProfileSteps/StepTwo";
import StepThree from "../components/ProfileSteps/StepThree";
import StepReview from "../components/ProfileSteps/StepReview";
import FormProgress from "../components/FormProgress";
// import Header from '../components/Header';
import Header from "../components/Header/index";
//  NEW:
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
        return <StepThree />;
      case 4:
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

    if (currentStep < 4) {
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

  // // Validate form data for each step
  // const validateStep = (step, profileData) => {
  //   // changed if to switch
  //   switch (step) {
  //     case 1:
  //       if (!profileData.fullName) return "Full name is required";
  //       if (!profileData.address) return "Address is required";
  //       if (!profileData.email || !profileData.email.includes("@"))
  //         return "A valid email is required";
  //       if (!profileData.phoneNumber) return "Phone number is required";
  //       break;
  //     case 2:
  //       if (profileData.company === "Yes") {
  //         // console.log("profile data: ", profileData);
  //         if (profileData.companyDetails.acn.toString().length !== 9)
  //           return "ACN must be 9 digits";

  //         if (!profileData.companyDetails.companyName)
  //           return "Company name is required";
  //       }
  //       break;
  //     case 3:
  //       if (!profileData.abn) return "ABN is required";
  //       if (profileData.abn.toString().length !== 11)
  //         return "ABN must be 11 digits";
  //       if (!profileData.brn) return "Builder Registration  is required";
  //       break;
  //     default:
  //       return null;
  //   }
  //   return;
  // };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="spinner-border text-primary" role="status">
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
        <FormProgress isCompleted={isCompleted} />
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
                    onClick={handlePrevious}
                  >
                    Previous
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-primary ms-auto"
                  onClick={handleNext}
                  disabled={loading}
                >
                  {loading
                    ? "Processing..."
                    : currentStep < 4
                    ? "Next"
                    : "Complete Profile"}
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
