import React from 'react';
import { useProfile } from '../../contexts/ProfileContext';
import CompanyInfo from './BusinessType/CompanyInfo';
import PartnershipInfo from './BusinessType/PartnershipInfo';
import IndividualInfo from './BusinessType/IndividualInfo';

const StepThree = () => {
  const { profileData } = useProfile();

  const renderContent = () => {
    if (profileData["businessType"] === "Company")
      return <CompanyInfo />;
    else if (profileData["businessType"] === "Partnership")
      return <PartnershipInfo />;
    else
      return <IndividualInfo />;
  };

  return (
    <div>
      {renderContent()}
    </div>
  );
};

export default StepThree;