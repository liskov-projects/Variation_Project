import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import API_BASE_URL from '../api';
import axios from 'axios';

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const { userId, getToken, isSignedIn } = useAuth();
  
  const [profileData, setProfileData] = useState({
    // Builder Information
    fullName: '',
    address: '',
    email: '',
    phoneNumber: '',
    
    // Company Information
    company: 'No',
    companyName: '',
    
    // Partnership Information
    partnership: 'No',
    numberOfPartners: '',
    partners: [],
    
    // Individual Information
    acn: '',
    abn: '',
    brn: '',
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load profile data when user signs in
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!isSignedIn || !userId) return;
      
      setLoading(true);
      try {

        const token = await getToken();
        const response = await axios.get(`${API_BASE_URL}/api/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
     
        if (response.data && response.dataprofileData) {
          setProfileData(response.data.profileData);
          setIsProfileComplete(response.data.profileSetupComplete || false);
        }
      } catch (err) {
        if (err.response && err.response.status !== 404) {
          setError('Failed to load profile data');
          console.error('Error fetching profile data:', err);
        }
        // 404 means profile doesn't exist yet, which is fine for new users
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [userId, getToken, isSignedIn]);

  // Update profile data
  const updateProfile = (updates) => {
    setProfileData(prev => ({ ...prev, ...updates }));
  };

  // Handle partner changes
  const updatePartner = (index, field, value) => {
    const updatedPartners = [...profileData.partners];
    if (!updatedPartners[index]) {
      updatedPartners[index] = { name: '', address: '' };
    }
    updatedPartners[index][field] = value;
    
    setProfileData(prev => ({
      ...prev,
      partners: updatedPartners
    }));
  };

  // Adjust partners array when number of partners changes
  useEffect(() => {
    if (profileData.partnership === 'Yes' && profileData.numberOfPartners) {
      const numPartners = parseInt(profileData.numberOfPartners);
      const currentPartners = [...profileData.partners];
      
      if (currentPartners.length !== numPartners) {
        let updatedPartners = [...currentPartners];
        
        // Add or remove partners as needed
        if (updatedPartners.length < numPartners) {
          while (updatedPartners.length < numPartners) {
            updatedPartners.push({ name: '', address: '' });
          }
        } else if (updatedPartners.length > numPartners) {
          updatedPartners = updatedPartners.slice(0, numPartners);
        }
        
        setProfileData(prev => ({
          ...prev,
          partners: updatedPartners
        }));
      }
    } else if (profileData.partnership === 'No') {
      // Clear partners if partnership is set to No
      setProfileData(prev => ({
        ...prev,
        partners: [],
        numberOfPartners: ''
      }));
    }
  }, [profileData.partnership, profileData.numberOfPartners]);

  // Save profile to backend
  const saveProfile = async (isComplete = false) => {
    if (!userId) return { success: false, error: 'User not authenticated' };
    
    setLoading(true);
    setError(null);
    
    try {
      const token = await getToken();
      
      // Validate important fields
      if (profileData.acn && profileData.acn.toString().length !== 9) {
        throw new Error('ACN must be exactly 9 digits');
      }
      
      if (profileData.abn && profileData.abn.toString().length !== 11) {
        throw new Error('ABN must be exactly 11 digits');
      }
      
      // Check if profile exists
      let userExists = false;
      try {
        const checkResponse = await axios.get(`${API_BASE_URL}/api/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        userExists = checkResponse.status === 200;
      } catch (err) {
        userExists = false;
      }
      
      const payload = {
        userId,
        email: profileData.email,
        profileData,
        profileSetupComplete: isComplete
      };
      
      let response;
      if (userExists) {
        // Update existing profile
        response = await axios.put(`${API_BASE_URL}/api/profile/${userId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Create new profile
        response = await axios.post(`${API_BASE_URL}/api/profile`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      setIsProfileComplete(isComplete);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to save profile';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Reset form data
  const resetProfile = () => {
    setProfileData({
      fullName: '',
      address: '',
      email: '',
      phoneNumber: '',
      company: 'No',
      companyName: '',
      partnership: 'No',
      numberOfPartners: '',
      partners: [],
      acn: '',
      abn: '',
      brn: '',
    });
    setCurrentStep(1);
  };

  const value = {
    profileData,
    currentStep,
    isProfileComplete,
    loading,
    error,
    updateProfile,
    updatePartner,
    setCurrentStep,
    saveProfile,
    resetProfile,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileContext;