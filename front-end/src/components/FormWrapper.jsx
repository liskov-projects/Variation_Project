import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import StepOne from '../pages/steps/StepOne';
import StepTwo from '../pages/steps/StepTwo';
import StepThree from '../pages/steps/StepThree';
import StepFour from '../pages/steps/StepFour';
import FormProgress from './FormProgress';
import useFormStorage from '../hooks/useFormStorage';
import Header from './Header';
import StepFive from '../pages/steps/StepFive';

const FormWrapper = () => {
  const { currentStep } = useFormStorage();
  const location = useLocation();

  const showFormProgress = location.pathname !== '/home' && location.pathname !== '/' && location.pathname !== '/welcome';
  const showHeader = location.pathname !== '/home' && location.pathname !== '/';
  return (
    <div>
      {showHeader&& <Header/>}
    <div className="d-flex">
      {showFormProgress && <FormProgress currentStep={currentStep} />}
      <div className="flex-grow-1">
        <Routes>
          <Route path="/step1" element={<StepOne />} />
          <Route path="/step2" element={<StepTwo />} />
          <Route path="/step3" element={<StepThree />} />
          <Route path="/step4" element={<StepFour />} />
          <Route path="/step5" element={<StepFive/>}/>
        </Routes>
      </div>
    </div>
    </div>
  );
};

export default FormWrapper;