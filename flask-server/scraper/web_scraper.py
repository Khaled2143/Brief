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

    image_tag = soup.find("img")
    image_url = (
        image_tag["src"] if image_tag and "src" in image_tag.attrs else "No image found"
    )

    scraped_data = {"title": title, "paragraphs": paragraphs, "image_url": image_url}

    if not os.path.exists("total_summaries"):
        os.makedirs("total_summaries")

    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    filename = f"total_summaries/scrape_{timestamp}.json"

    with open(filename, "w") as file:
        json.dump(scraped_data, file, indent=4)

    return {"title": title, "paragraphs": paragraphs}
