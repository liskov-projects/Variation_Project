// src/contexts/ProfileContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import API_BASE_URL from "../api";
import axios from "axios";

const ProfileContext = createContext();
export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const { userId, getToken, isSignedIn } = useAuth();

  const [profileData, setProfileData] = useState({
    fullName: "",
    address: "",
    email: "",
    phoneNumber: "",
    businessType: "Individual", // New unified field

    // Company
    companyDetails: {
      companyName: "",
      acn: "",
    },

    // Partnership
    numberOfPartners: "",
    partners: [],

    // Individual
    abn: "",
    brn: "",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!isSignedIn || !userId) return;

      setLoading(true);
      try {
        const token = await getToken();
        const response = await axios.get(`${API_BASE_URL}/api/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.profileData) {
          setProfileData(response.data.profileData);
          setIsProfileComplete(response.data.profileSetupComplete || false);
        }
      } catch (err) {
        if (err.response?.status !== 404) {
          setError("Failed to load profile data");
          console.error("Error fetching profile data:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId, getToken, isSignedIn]);

  const updateProfile = (updates) => {
    setProfileData((prev) => ({ ...prev, ...updates }));
  };

  const updatePartner = (index, field, value) => {
    const updatedPartners = [...profileData.partners];
    if (!updatedPartners[index]) {
      updatedPartners[index] = { name: "", address: "" };
    }
    updatedPartners[index][field] = value;

    setProfileData((prev) => ({
      ...prev,
      partners: updatedPartners,
    }));
  };

  useEffect(() => {
    if (profileData.businessType === "Partnership" && profileData.numberOfPartners) {
      const numPartners = parseInt(profileData.numberOfPartners);
      const currentPartners = [...profileData.partners];

      if (currentPartners.length !== numPartners) {
        let updatedPartners = [...currentPartners];

        while (updatedPartners.length < numPartners) {
          updatedPartners.push({ name: "", address: "" });
        }

        if (updatedPartners.length > numPartners) {
          updatedPartners = updatedPartners.slice(0, numPartners);
        }

        setProfileData((prev) => ({
          ...prev,
          partners: updatedPartners,
        }));
      }
    } else if (profileData.businessType !== "Partnership") {
      setProfileData((prev) => ({
        ...prev,
        partners: [],
        numberOfPartners: "",
      }));
    }
  }, [profileData.businessType, profileData.numberOfPartners]);

  const saveProfile = async (isComplete = false) => {
    if (!userId) return { success: false, error: "User not authenticated" };

    setLoading(true);
    setError(null);

    try {
      const token = await getToken();

      if (
        profileData.companyDetails?.acn &&
        profileData.companyDetails.acn.toString().length !== 9
      ) {
        throw new Error("ACN must be exactly 9 digits");
      }

      if (profileData.abn && profileData.abn.toString().length !== 11) {
        throw new Error("ABN must be exactly 11 digits");
      }

      let userExists = false;
      try {
        const checkResponse = await axios.get(`${API_BASE_URL}/api/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        userExists = checkResponse.status === 200;
      } catch {
        userExists = false;
      }

      const payload = {
        userId,
        email: profileData.email,
        profileData,
        profileSetupComplete: isComplete,
      };

      const response = userExists
        ? await axios.put(`${API_BASE_URL}/api/profile/${userId}`, payload, {
            headers: { Authorization: `Bearer ${token}` },
          })
        : await axios.post(`${API_BASE_URL}/api/profile`, payload, {
            headers: { Authorization: `Bearer ${token}` },
          });

      setIsProfileComplete(isComplete);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to save profile";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const resetProfile = () => {
    setProfileData({
      fullName: "",
      address: "",
      email: "",
      phoneNumber: "",
      businessType: "Individual",
      companyDetails: {
        companyName: "",
        acn: "",
      },
      numberOfPartners: "",
      partners: [],
      abn: "",
      brn: "",
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

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export default ProfileContext;
