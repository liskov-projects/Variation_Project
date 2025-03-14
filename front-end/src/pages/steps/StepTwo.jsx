import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFormStorage from '../../hooks/useFormStorage';

const StepThree = () => {
    const navigate = useNavigate();
    const { formData, updateFormData, setCurrentStep } = useFormStorage();
    const [companyResult,setCompanyResult]=useState();
    const [partnershipResult,setPartnershipResult]=useState();
    const [partners, setPartners] = useState([]);

    useEffect(() => {
        setCurrentStep(2);
    }, []);

    // Update the company Yes or No option details
    useEffect(()=>{
        setCompanyResult(formData.company);
    },[formData.company])


    useEffect(()=>{
        setPartnershipResult(formData.partnership);
    },[formData.partnership])

    useEffect(()=>{
        if (formData.numberOfPartners){
            const initialPartners = Array.from({length:formData.numberOfPartners},()=>({
                name:'',
                address:'',
            }));
            setPartners(initialPartners);
        }
    },[formData.numberOfPartners])
    

    const handlePartnerChange=(index,field,value)=>{
        const updatedPartners=partners.map((partner,i)=>
            i===index ? {...partner,[field]:value}:partner
        );
        setPartners(updatedPartners);
        updateFormData({partners:updatedPartners})
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setCurrentStep(4);
        navigate('/step4');
    };

    return (
        <div className="container py-4">
        <h2 className="mb-4">Additional Information</h2>
        <form onSubmit={handleSubmit}>
            {/* Company details */}
            <div className="mb-3">
            <label className="form-label">Company</label>
            <div>
            <div className="form-check">
            <input
                type="radio"
                name="Yes"
                className="form-check-input"
                value="Yes"
                checked={formData.company === 'Yes'}
                onChange={(e) => updateFormData({ company: e.target.value })}
            />
            Yes
            </div>
            <div className="form-check">
            <input
                type="radio"
                name="No"
                className="form-check-input"
                value="No"
                checked={formData.company === 'No'}
                onChange={(e) => updateFormData({ company: e.target.value })}
            />
            No
            </div>
            </div>
            </div>

            {/* Partnership details */}
            <div className="mb-3">
            <label className="form-label">Partnership</label>
            <div>
            <div className="form-check">
            <input
                type="radio"
                name="Yes"
                className="form-check-input"
                value="Yes"
                checked={formData.partnership === 'Yes'}
                onChange={(e) => updateFormData({ partnership: e.target.value })}
            />
            Yes
            </div>
            <div className="form-check">
            <input
                type="radio"
                name="No"
                className="form-check-input"
                value="No"
                checked={formData.partnership === 'No'}
                onChange={(e) => updateFormData({ partnership: e.target.value })}
            />
            No
            </div>
            </div>
            </div>

            {/* When company is Yes. When No nothing is displayed */}
            {
            companyResult==="Yes" &&
            <div className="mb-3">
            <label className="form-label">Company Name</label>
            <input
                type="text"
                className="form-control"
                value={formData.companyName || ''}
                onChange={(e) => updateFormData({ companyName: e.target.value })}
                required
            />
            </div>
            }

            {/* When the partnership is selected Yes below fields are displayed. When the option is No nothing */}
            {
            partnershipResult==="Yes" &&
            <div className="mb-3">
            <label className="form-label">Number of Partners</label>
            <input
                type="number"
                className="form-control"
                value={formData.numberOfPartners || ''}
                onChange={(e) => updateFormData({ numberOfPartners: e.target.value })}
                required
            />
            {partners.map((partner,index)=>(
                <div key={index} className='mb-3'>
                    <label className='form-label'>Partner {index+1} Name</label>
                    <input 
                        type='text'
                        className='form-control'
                        value={partner.name}
                        onChange={(e)=>handlePartnerChange(index,'name',e.target.value)}
                        required/>
                        <label className="form-label">Partner {index + 1} Address</label>
          <input
            type="text"
            className="form-control"
            value={partner.address}
            onChange={(e) => handlePartnerChange(index, 'address', e.target.value)}
            required
          />
                </div>
            ))

            }
            </div>
            }


            <button type="submit" className="btn btn-primary float-end">
            Next
            </button>
        </form>
        </div>
    );
    };

export default StepThree;