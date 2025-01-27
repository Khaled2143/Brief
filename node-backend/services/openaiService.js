import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OpenAI_API_KEY,
});

const completion = async (contentList) => {
  try {
    console.log("CONTENT LIST RECEIVED".contentList);

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
    You are an expert summarizer tasked with providing unbiased, concise, and professional summaries of web scraped article data. Your goal is to create a summary that captures the most important key points, ensuring the information can be read and understood in 1-2 minutes.

        When summarizing:
        1. Avoid inserting personal opinions or any form of bias.
        2. Highlight critical facts, data points, and takeaways, especially when discussing complex policies or events.
        3. Use simple, clear, and accessible language to explain complex topics, ensuring readers with no prior knowledge can understand.
        4. Maintain a professional but communicative tone, as if explaining to an informed yet busy audience.

        The structure of your summary should include:
        - A one-sentence introduction summarizing the overall topic or theme of the article.
        - The most relevant key points or events in a logical flow, prioritized by importance.
        - If the article discusses policies or concepts, provide brief explanations in plain language for clarity.
        - Avoid quoting unless absolutely necessary to preserve the context.

        The summary should not exceed 300 words.

        Here your data: 
        ${formattedContent}
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

    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error("Error fetching completion:", error);
  }
};

export default completion;
