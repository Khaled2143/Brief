from openai import OpenAI
import os
from datetime import datetime
import json

# Use a relative path to store the file
file_path = os.path.join(os.path.dirname(__file__), "../Hidden-API/api_key.txt")


with open(file_path, "r") as file:
    api_key_org = file.read().strip()

client = OpenAI(
    # defaults to os.environ.get("OPENAI_API_KEY")
    api_key=api_key_org,
)


def chat_with_gpt(prompt):
    response = client.chat.completions.create(
        model="gpt-4o", messages=[{"role": "user", "content": prompt}]
    )

    response_data = {
        "prompt": prompt,
        "response": response.choices[0].message.content.strip(),
        "timestamp": datetime.now().strftime("%Y-%m-%d_%H-%M-%S"),
    }

    if not os.path.exists("total_responses"):
        os.makedirs("total_responses")

    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    filename = f"total_responses/response_{timestamp}.json"

    with open(filename, "w") as file:
        json.dump(response_data, file, indent=4)
        file.flush()
        print(f"Finished writing to file: {filename}")

    print(response.choices[0].message.content.strip())

    return response.choices[0].message.content.strip()
