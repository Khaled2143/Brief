import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OpenAI_API_KEY,
});

const completion = async (contentList) => {
  try {
    if (
      !contentList ||
      !contentList.title ||
      !Array.isArray(contentList.uniqueParagraphs)
    ) {
      throw new Error(
        "Invalid input: contentList must have a title string and a paragraphs array"
      );
    }

    const formattedContent = `${
      contentList.title
    }\n\n${contentList.uniqueParagraphs.join("\n")}`;

    const prompt = `
        You are an expert summarizer tasked with providing unbiased, concise, and professional summaries of web-scraped article data. Your goal is to create a summary that highlights the most important key points, ensuring the information can be read and understood in 1-2 minutes.

        When summarizing:
        1. Avoid inserting personal opinions, subjective commentary, or any form of bias.
        2. Highlight critical facts, data points, and takeaways, particularly when discussing complex policies or events.
        3. Use simple, clear, and accessible language to explain intricate topics, ensuring readers with no prior knowledge can understand.
        4. Maintain a professional yet approachable tone, as if addressing an informed but busy audience.
        5. Add a concise and professional **title** summarizing the overall theme of the article.
        6. **Format the output in the following JSON structure for consistency**:

        
        {
        "title": "Title of the Summary",
        "sections": [
            {
            "header": "Introduction",
            "content": "A brief overview summarizing the article’s main theme."
            },
            {
            "header": "Key Policies",
            "content": "Key points and brief explanations of policies discussed in the article."
            }
            // Include additional sections as necessary based on the article content
        ]
        }
        

        The structure of your summary should include:
        - A single title summarizing the overall topic or theme of the article.
        - The most relevant key points grouped logically into sections, each introduced with a **header** and followed by its **content**.
        - Each content field should provide concise key points and brief explanations in plain language.
        - Avoid quoting unless absolutely necessary to preserve critical context.
        - Ensure the total output does not exceed 300 words.

        Here is your data: ${formattedContent}
            `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful assistant" },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching completion:", error);
  }
};

export default completion;
