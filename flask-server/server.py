from flask import Flask
from scraper.web_scraper import scrape
from summarize.ai_summarize import chat_with_gpt

app = Flask(__name__)


@app.route("/")
def home():
    return "Welcome to the home screen"


@app.route("/scrape")
def scrape_route():
    return scrape()


@app.route("/summarize")
def summarize_route():
    prompt = "Summarize the contents of the scraped data leaving only the most important information of changes of what you summarized"
    return {"response" : chat_with_gpt(prompt)}


if __name__ == "__main__":
    app.run(debug=True)
