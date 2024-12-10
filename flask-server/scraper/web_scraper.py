from flask import Flask
from bs4 import BeautifulSoup
import requests
import json



# Web Scraping

url = "https://www.dw.com/en/us-trump-outlines-sweeping-policy-agenda-in-tv-interview/a-70996947"

page = requests.get(url)

soup = BeautifulSoup(page.text, "html.parser")

def scrape():
    title = soup.find("h1").text if soup.find("h1") else "No Title Found"

    paragraphs = [p.text for p in soup.find_all("p")]

    data = {"title": title, "paragraphs": paragraphs}

    with open("scrapped_data.json", "w") as json_file:
        json.dump(data, json_file, indent=4)

    return {"message": "Data scrapped and saved to scrapped_data.json"}

