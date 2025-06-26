import axios from "axios";
import API_BASE_URL from "../api";
const formSubmitApi = async (userId, email, formData, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/forms/submit`,
      { userId, email, formData },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting form: ", error);
    // return error.message;
    throw error;
  }
};

export default formSubmitApi;
