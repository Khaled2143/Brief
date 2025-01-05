import axios from "axios";

const retrieveComments = async (id) => {
  try {
    const response = await axios.get(
      `http://localhost:5001/api/discussions/${id}/comments`
    );

    if (response.data.success) {
      return response.data.comments;
    } else {
      throw new Error(response.data.message || "Failed to retrieve comments");
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export default retrieveComments;
