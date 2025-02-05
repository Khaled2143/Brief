import axios from "axios";
import * as cheerio from "cheerio";

const scraper = async (url) => {
  try {
    const response = await axios.get(url);

    const html = response.data;

    const $ = cheerio.load(html);

    const title = $("title").text(); //Extract the page title
    const paragraphs = $("p")
      // If you have many <p> tags in your HTML, domElement is one of those p tags that cheerio is currently working on in the loop
      .map((index, domElement) => $(domElement).text().trim())
      .get()
      .filter((text) => text.length > 0);

    const relevantParagraphs = paragraphs.filter((text) => text.length > 50);
    const uniqueParagraphs = [...new Set(relevantParagraphs)];

    
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


export default scraper;
