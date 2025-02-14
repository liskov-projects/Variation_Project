import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFormStorage from '../../hooks/useFormStorage';

const StepThree = () => {
    const navigate = useNavigate();
    const { formData, updateFormData, setCurrentStep } = useFormStorage();
    const [superbowlResult,setSuperbowlResult]=useState();

    useEffect(()=>{
        setSuperbowlResult(formData.superbowl);
    },[formData.superbowl])

    useEffect(() => {
        setCurrentStep(3);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setCurrentStep(4);
        navigate('/step4');
    };

    return (
        <div className="container py-4">
        <h2 className="mb-4">Additional Information</h2>
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
            <label className="form-label">Will you be watching Superbowl 2025?</label>
            <div>
            <div className="form-check">
            <input
                type="radio"
                name="Yes"
                className="form-check-input"
                value="Yes"
                checked={formData.superbowl === 'Yes'}
                onChange={(e) => updateFormData({ superbowl: e.target.value })}
            />
            Yes
            </div>
            <div className="form-check">
            <input
                type="radio"
                name="No"
                className="form-check-input"
                value="No"
                checked={formData.superbowl === 'No'}
                onChange={(e) => updateFormData({ superbowl: e.target.value })}
            />
            No
            </div>
            </div>
            </div>
            {superbowlResult==="Yes"
            
            ?
            
            <div className="mb-3">
                <label className="form-label">Who do you think will win?</label>
                <select
                    className="form-select"
                    value={formData.superbowlWinner || ''}
                    onChange={(e) => updateFormData({ superbowlWinner: e.target.value })}
                    required
                >
                    <option value="">Select a Team</option>
                    <option value="Kansas City Chiefs">Kansas City Chiefs</option>
                    <option value="Philadelphia Eagles">Philadelphia Eagles</option>
                </select>
            </div>
            
            :
            
            <div className="mb-3">
            <label className="form-label">What is your favorite Sport?</label>
            <input
                type="text"
                className="form-control"
                value={formData.favSport || ''}
                onChange={(e) => updateFormData({ favSport: e.target.value })}
                required
            />
            
            <div className="mb-3">
             <label className="form-label">Can you mention few reasons as to why you like that sport?</label>
           <textarea
             className="form-control"
             value={formData.favReason || ''}
             onChange={(e) => updateFormData({ favReason: e.target.value })}
             required
          />
        </div>
        
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