import './App.css';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import StepOne from './pages/steps/StepOne';
import StepTwo from './pages/steps/StepTwo';
import StepThree from './pages/steps/StepThree';
import StepFour from './pages/steps/StepFour';
import useFormStorage from './hooks/useFormStorage';
import FormProgress from './components/FormProgress';

function App() {
  const { currentStep } = useFormStorage();
  const location = useLocation();

  const showFormProgress = location.pathname !== '/home';

  return (
    <div className="d-flex">
      {showFormProgress && <FormProgress currentStep={currentStep} />}
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/step1" element={<StepOne />} />
          <Route path="/step2" element={<StepTwo />} />
          <Route path="/step3" element={<StepThree />} />
          <Route path="/step4" element={<StepFour />} />
        </Routes>
      </div>
    </div>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper;