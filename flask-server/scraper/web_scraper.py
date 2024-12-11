from flask import Flask
from bs4 import BeautifulSoup
import requests
import json
import os
from datetime import datetime


# Web Scraping


def scrape(url):

    page = requests.get(url)
    soup = BeautifulSoup(page.text, "html.parser")

    title = soup.find("h1").text if soup.find("h1") else "No Title Found"

    paragraphs = [p.text for p in soup.find_all("p")]

    scraped_data = {"title": title, "paragraphs": paragraphs}

    if not os.path.exists("total_summaries"):
        os.makedirs("total_summaries")

    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    filename = f"total_summaries/scrape_{timestamp}.json"

    with open(filename, "w") as file:
        json.dump(scraped_data, file, indent=4)

    return {"title": title, "paragraphs": paragraphs}
