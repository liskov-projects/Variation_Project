import React, { useEffect, useState } from 'react';
import {useSearchParams} from 'react-router-dom';
import axios from 'axios';

const SignaturePage=()=>{
    const [searchParams] = useSearchParams();
    const token=searchParams.get('token');
    const [variation, setVariation]=useState(null);
    const [error, setError] = useState(null);

    useEffect(()=>{
        const fetchVariation = async()=>{
            try {
                const response = await axios.get(`/api/variations/validate-token?token=${token}`);
                setVariation(response.data.variation);
            } catch (error) {
                setError(error.response?.data?.message || 'Invalid or expired token')
            }
        }
        if (token){
            fetchVariation()
        }else{
            setError('No token provided')
        }
    }, [token])

    if (error) {
        return <div>Error: {error}</div>;
      }
    
      if (!variation) {
        return <div>Loading...</div>;
      }
    //   Should change variation.description
      return (
        <div>
          <h1>Sign Variation</h1>
          <p>Description: {variation.description}</p>
          <button onClick={() => alert('Signature submitted!')}>Sign</button>
        </div>
      );
}

export default SignaturePage;