import React,{useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import useFormStorage from '../../hooks/useFormStorage';

const StepFive = () => {
  const navigate = useNavigate();
  const { formData, setCurrentStep, clearFormData } = useFormStorage();

  useEffect(() => {
        setCurrentStep(5);
    }, []);

    const handleCreateNewForm = () => {
        clearFormData();
        setCurrentStep(1)
        navigate('/step1'); // Navigate to the first step to create a new form
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    const formData = JSON.parse(localStorage.getItem("formData"));
    const formattedData = Object.entries(formData).map(([key, value]) => `${key}: ${value}`).join('\n');
    const lines = doc.splitTextToSize(formattedData, 180); // Split text to fit within the page width
    doc.text(lines, 10, 10);
    doc.save('form.pdf');
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Form Saved Successfully</h2>
      <button className="btn btn-primary me-2" onClick={handleCreateNewForm}>
        Create New Form
      </button>
      <button className="btn btn-secondary" onClick={handleDownloadPdf}>
        Download the form as PDF
      </button>
    </div>
  );
};

export default StepFive;