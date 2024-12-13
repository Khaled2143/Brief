from flask import Flask
from scraper.web_scraper import scrape
from summarize.ai_summarize import chat_with_gpt
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return "Welcome to the home screen"


# @app.route("/scrape")
# def scrape_route():
#     return scrape()


URLS_TO_SCRAPE = [
    "https://www.foxnews.com/politics/trump-says-wray-resignation-great-day-america-touts-kash-patel-most-qualified-lead-fbi",
    "https://www.cnn.com/2024/12/11/politics/cnn-poll-trump-transition/index.html",
    "https://mashable.com/article/pornhub-year-in-review-2024",
]


@app.route("/summarize")
def summarize_route():
    articles = []

    for url in URLS_TO_SCRAPE:
        try:
            scraped_data = scrape(url)

            full_content = "".join(scraped_data.get("paragraphs", []))

            summary = chat_with_gpt(
                f"Summarize this article. Ensure you are clear, concise, and to the point. "
                f"If you believe there may be a word that some people may not know, please explain it. "
                f"The point of summarization is for people to have quick reads and quick information: {full_content}"
            )

            concise_headline = (
                chat_with_gpt(
                    f"Generate a concise, clear, and short (20 characters max) headline for this article. Make sure no quotation marks or any other designs are present: {scraped_data['title']}"
                )
                .strip()
                .replace('"', "")
                .replace("'", "")
            )

            articles.append(
                {
                    "headline": concise_headline,
                    "content": summary,
                    "image_url": scraped_data.get(
                        "image_url",
                    ),
                }
            )
        except Exception as e:
            print(f"Error processing URL {url}: {e}")
            continue

    return {"articles": articles}


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
