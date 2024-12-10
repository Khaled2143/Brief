from openai import OpenAI
import os

# Use a relative path to store the file
file_path = os.path.join(os.path.dirname(__file__), "../Hidden-API/api_key.txt")


with open(file_path, "r") as file:
    api_key_org = file.read().strip()

client = OpenAI(
    # defaults to os.environ.get("OPENAI_API_KEY")
    api_key=api_key_org,
)


def chat_gpt(prompt):
    response = client.chat.completions.create(
        model="gpt-4o", messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content.strip()


if __name__ == "__main__":
    while True:
        user_input = input("You: ")
        if user_input.lower() in ["quit", "exit", "bye"]:
            print("Goodbye!")
            break
        response = chat_gpt(user_input)
        print(f"ChatGPT: {response}")
