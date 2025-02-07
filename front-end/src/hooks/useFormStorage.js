import { useState, useEffect } from 'react';

const useFormStorage = () => {
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('formData');
    return savedData ? JSON.parse(savedData) : {};
  });

  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = localStorage.getItem('currentStep');
    return savedStep ? parseInt(savedStep) : 1;
  });

  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
    localStorage.setItem('currentStep', currentStep.toString());
  }, [formData, currentStep]);

  const updateFormData = (newData) => {
    setFormData(prev => ({
      ...prev,
      ...newData
    }));
  };

  const clearFormData = () => {
    localStorage.removeItem('formData');
    localStorage.removeItem('currentStep');
    setFormData({});
    setCurrentStep(1);
  };

  return {
    formData,
    currentStep,
    setCurrentStep,
    updateFormData,
    clearFormData
  };
};

export default useFormStorage;