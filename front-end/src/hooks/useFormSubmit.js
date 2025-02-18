import { useState } from "react";
import formSubmitApi from "../utils/formSubmitApi";

const useFormSubmit=()=>{
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const submitForm=async(userId,email,formData,token)=>{
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const res=await formSubmitApi(userId,email,formData,token);
            setSuccess(true);
            return res
        } catch (error) {
            setError(error)
        }finally{
            setLoading(false);
        }
    }
    return {submitForm,loading,error,success}
}

export default useFormSubmit;