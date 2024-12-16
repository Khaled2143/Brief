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

    # Find all images
    image_tag = soup.find("meta", property="og:image")
    image_url = image_tag["content"] if image_tag else None

    # Extract 'src' attribute if available
    if image_tag and "src" in image_tag.attrs:
        image_url = image_tag["src"]

    # Use fallback URL if no valid image is found
    if not image_url:
        image_url = "https://via.placeholder.com/150"

    return {
        "title": soup.find("h1").text if soup.find("h1") else "No Title Found",
        "paragraphs": [p.text for p in soup.find_all("p")],
        "image_url": image_url,
    }
