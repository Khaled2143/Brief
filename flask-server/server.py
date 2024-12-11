from flask import Flask
from scraper.web_scraper import scrape
from summarize.ai_summarize import chat_with_gpt

app = Flask(__name__)


@app.route("/")
def home():
    return "Welcome to the home screen"


# @app.route("/scrape")
# def scrape_route():
#     return scrape()


@app.route("/summarize")
def summarize_route():
    scraped_data = scrape(
        "https://www.dw.com/en/us-trump-outlines-sweeping-policy-agenda-in-tv-interview/a-70996947"
    )

    title = scraped_data.get("title", "No Title Found")
    paragraphs = scraped_data.get("paragraphs", [])

    data_to_summarize = f"Title: {title}\nContent: {' '.join(paragraphs)}"

    prompt = (
        "Please summarize the following information in a concise and unbiased manner. "
        "Highlight only the critical changes or updates that readers need to know. "
        "Make sure to explain certain key policies that most people may not know the meaning of."
        "Keep the summary clear and to the point.\n"
        f"{data_to_summarize}"
    )

    summary = chat_with_gpt(prompt)

    return {"response": summary}


if __name__ == "__main__":
    app.run(debug=True)
