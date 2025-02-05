import axios from "axios";
import { useState, useEffect } from "react";

const updateImage = async (summaryID, imageFileName) => {
  const newImageUrl = `http://localhost:5001/images/${imageFileName}`;
  try {
    const response = await axios.patch(
      `http://localhost:5001/api/summaries/${summaryID}/image`,
      { imageUrl: newImageUrl }
    );
    console.log("Image updated successfully", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating image:", error);
    return null;
  }
};

const summaryID = "67a296749859e3c8b68372a1";
const imageFileName = "Trump_Signing_Papers.jpg";
updateImage(summaryID, imageFileName);

export default updateImage;
