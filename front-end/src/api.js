// Try multiple backend ports for flexibility
const getApiUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Default to the current Docker setup
  return "http://localhost:5002";
};

const API_BASE_URL = getApiUrl();
export default API_BASE_URL;

// Alternative ports for different setups:
// http://localhost:5000 - Alternative local setup
// http://localhost:5001 - Original local setup  
// http://localhost:5002 - Current Docker setup
