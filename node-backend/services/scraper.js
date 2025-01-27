import axios from "axios";
import * as cheerio from "cheerio";

const scraper = async (url) => {
  try {
    const response = await axios.get(url);

    const html = response.data;

    const $ = cheerio.load(html);

    const title = $("title").text(); //Extract the page title
    const paragraphs = $("p")
      .map((i, el) => $(el).text().trim())
      .get()
      .filter((text) => text.length > 0);

    const relevantParagraphs = paragraphs.filter((text) => text.length > 50);
    const uniqueParagraphs = [...new Set(relevantParagraphs)];

    console.log("TITLE:", title);
    console.log("PARAGRAPHS:", uniqueParagraphs);

    return { title, uniqueParagraphs };
  } catch (error) {
    if (error.response) {
      console.error(`HTTP Error: ${error.response.status}`);
    } else if (error.request) {
      console.error("No response received from the server");
    } else {
      console.error("Error during scraping:", error.message);
    }
  }
};
scraper(
  "https://apnews.com/article/what-has-trump-done-trump-executive-orders-f061fbe7f08c08d81509a6af20ef8fc0"
);
