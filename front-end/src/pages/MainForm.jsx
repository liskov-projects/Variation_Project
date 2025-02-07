import React from 'react';
import {  StepTwo, StepThree, StepFour } from '../components/FormSteps/index.js';
import StepOne from '../components/FormSteps/StepOne.jsx';
import useMultiStepForm from '../hooks/useMultiStepForm.js';
// import '../styles/MainForm.css';

const MainForm = ()=>{

    const {
        currentStep, formData, handleInputChange, nextStep, prevStep, isFirstStep,
        isLastStep,
    }=useMultiStepForm();

    const handleSubmit=(e)=>{
        e.preventDefault();
        if(!isLastStep){
            nextStep();
        }else{
            console.log('Form submitted: ',formData)
        }
    }

    const renderStep =()=>{
        switch(currentStep){
            case 1:
                return <StepOne formData={formData} handleInputChange={handleInputChange}/>;
            case 2:
                return <StepTwo formData={formData} handleInputChange={handleInputChange}/>;
            case 3:
                return <StepThree formData={formData} handleInputChange={handleInputChange}/>;
            case 4:
                return <StepFour formData={formData} />;
            default:
                return null; 

        }
    };

    return (
        <div className="container mt-5">
            <div className="progress-bar mb-4">
                {[1,2,3,4].map((step)=>(
                    <div key={step}
                    className={`step ${currentStep >= step ? 'active':''}`}>
                        {step}
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit}>
                {renderStep()}

                <div className='d-flex justify-content-between mt-4'>
                    {!isFirstStep && (
                        <button 
                        type='button'
                        className='btn btn-secondary'
                        onClick={prevStep}
                        >
                            Previous
                        </button>
                    )}
                    <button type='submit' className="btn btn-primary ms-auto">
                        {isLastStep ? 'Submit':'Next'}
                    </button>
                </div>
            </form>
        </div>
 
    )
}

export default MainForm;