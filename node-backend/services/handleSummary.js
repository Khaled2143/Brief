import completion from "./openaiService.js";
import scraper from "./scraper.js";

const HandleSummary = async () => {
  try {
    const data = await scraper(
      "https://apnews.com/article/what-has-trump-done-trump-executive-orders-f061fbe7f08c08d81509a6af20ef8fc0"
    );


    const summary = await completion(data);

    console.log(summary);
  } catch (error) {
    console.error("Error handling summary:", error);
  }
};

HandleSummary();

export default HandleSummary;
