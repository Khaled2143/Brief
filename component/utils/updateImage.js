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

const summaryID = "679854b4fe242d24bd16ab7f";
const imageFileName = "Trump_2.jpg";
updateImage(summaryID, imageFileName);

export default updateImage;
