import os
import textwrap
import openai

# -------------------------
# CONFIG
# -------------------------
PROJECT_DIR = r"C:\Users\Uggr\Desktop\Avoider-Game-HTML5-master"  # <-- Change this
CHUNK_SIZE = 3000  # approx chars per chunk
OPENAI_API_KEY = "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"  # <-- Set your API key
MODEL = "gpt-5-mini"  # or another GPT model

openai.api_key = OPENAI_API_KEY

# -------------------------
# FUNCTIONS
# -------------------------
def read_all_files(project_dir):
    """Recursively read .js, .html, .css, .json files."""
    file_contents = {}
    for root, dirs, files in os.walk(project_dir):
        for file in files:
            if file.endswith(('.js', '.html', '.css', '.json')):
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        file_contents[path] = f.read()
                except Exception as e:
                    print(f"Error reading {path}: {e}")
    return file_contents

def chunk_text(text, chunk_size=CHUNK_SIZE):
    """Split text into chunks of roughly chunk_size characters."""
    return textwrap.wrap(text, width=chunk_size, replace_whitespace=False)

def send_to_chatgpt(messages):
    """Send conversation context to ChatGPT and get a reply."""
    response = openai.chat.completions.create(
        model=MODEL,
        messages=messages,
    )
    return response.choices[0].message.content

# -------------------------
# MAIN
# -------------------------
if __name__ == "__main__":
    # Step 1: Read all project files
    all_files = read_all_files(PROJECT_DIR)
    
    # Step 2: Create conversation memory
    conversation = [{"role": "system", "content": "You are an expert developer assisting with a HTML5/JS game project."}]
    
    # Step 3: Feed all files in chunks
    for path, content in all_files.items():
        chunks = chunk_text(content)
        for i, chunk in enumerate(chunks, 1):
            message = {
                "role": "user",
                "content": f"File: {path} (chunk {i}/{len(chunks)})\n```\n{chunk}\n```"
            }
            conversation.append(message)
            # Optionally get an acknowledgment (or skip to save API usage)
            reply = send_to_chatgpt(conversation)
            print(f"Processed {path} chunk {i}/{len(chunks)}")
    
    # Step 4: Interactive querying loop
    print("\nAll files fed to ChatGPT. You can now ask questions about your project!")
    while True:
        user_input = input("\nYour question (or 'exit' to quit): ")
        if user_input.lower() == "exit":
            break
        conversation.append({"role": "user", "content": user_input})
        reply = send_to_chatgpt(conversation)
        print("\nChatGPT says:\n", reply)
