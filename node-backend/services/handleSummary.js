import completion from "./openaiService.js";
import scraper from "./scraper.js";
import axios from "axios";

const HandleSummary = async () => {
  try {
    const data = await scraper(
      "https://19thnews.org/2025/01/trump-reinstates-the-global-gag-rule-on-abortion/"
    );

    const summaryRaw = await completion(data);
    const summaryCleaned = summaryRaw
      .replace(/(^```json|```$)/gm, "") // Removes backticks and `json`
      .replace(/^json/, "") // Removes the `json` prefix
      .trim(); // Trims extra whitespace

    const summary = JSON.parse(summaryCleaned);

    console.log(summary);

    await axios.post("http://localhost:5001/api/summaries", {
      title: summary.title,
      section: summary.sections,
    });

    console.log("Summary successfully saved to the backend!");
  } catch (error) {
    console.error("Error handling summary:", error);
  }
};

HandleSummary();

export default HandleSummary;
