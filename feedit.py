import os
import hashlib
import openai

# ---------------- CONFIG ----------------
openai.api_key = "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"  # <-- Set your API key
PROJECT_DIR = r"C:\Users\Uggr\Desktop\HIT_ME_GE_1"
CHUNK_SIZE = 3000  # approx character size per chunk
USE_SUMMARIES = True  # Summarize files larger than CHUNK_SIZE

# ---------------- HELPERS ----------------
def get_file_hash(content):
    return hashlib.md5(content.encode('utf-8')).hexdigest()

def read_repo_files(project_dir):
    """Read all .js, .html, .css files recursively and return path, content, hash."""
    file_contents = []
    for root, dirs, files in os.walk(project_dir):
        for file in files:
            if file.endswith(('.js', '.html', '.css')):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    file_hash = get_file_hash(content)
                    file_contents.append((os.path.relpath(path, project_dir), content, file_hash))
    return file_contents

def chunk_or_summarize(file_tuple, chunk_size=CHUNK_SIZE):
    """Chunk large files, or summarize if too big."""
    path, content, file_hash = file_tuple
    chunks = []
    if USE_SUMMARIES and len(content) > chunk_size:
        # Summarize file for token efficiency
        summary_prompt = f"Summarize this file content for code review purposes:\nFile: {path}\n{content}"
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": summary_prompt}]
        )
        summary = response.choices[0].message.content
        chunks.append(f"File: {path} (summary)\n{summary}")
    else:
        # Split into chunks
        start = 0
        while start < len(content):
            end = start + chunk_size
            chunk = content[start:end]
            chunks.append(f"File: {path}\n{chunk}")
            start = end
    return chunks, file_hash

# ---------------- CHAT FUNCTION ----------------
def send_to_chatgpt(messages):
    response = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages
    )
    return response.choices[0].message.content

# ---------------- MAIN SCRIPT ----------------
def main():
    file_hashes = {}  # Keep track of last known file hashes
    conversation = []

    def feed_repo():
        nonlocal conversation, file_hashes
        print("Reading repo files...")
        files = read_repo_files(PROJECT_DIR)
        new_chunks = []
        for file_tuple in files:
            path, content, file_hash = file_tuple
            # Only feed if file is new or modified
            if path not in file_hashes or file_hashes[path] != file_hash:
                chunks, _ = chunk_or_summarize(file_tuple)
                new_chunks.extend(chunks)
                file_hashes[path] = file_hash
        if new_chunks:
            for chunk in new_chunks:
                conversation.append({"role": "system", "content": chunk})
            print(f"Fed {len(new_chunks)} chunks to ChatGPT.")
        else:
            print("No changes detected; nothing to feed.")

    feed_repo()  # initial feed
    print("Repo loaded. Type your prompt. Type 'REFEED_REPO' to reload modified files. Type 'exit' to quit.")

    while True:
        user_input = input("\nYour prompt: ").strip()
        if user_input.lower() == "exit":
            break
        elif user_input.upper() == "REFEED_REPO":
            feed_repo()
            continue
        else:
            conversation.append({"role": "user", "content": user_input})
            reply = send_to_chatgpt(conversation)
            print(f"\nChatGPT says:\n{reply}")
            conversation.append({"role": "assistant", "content": reply})

if __name__ == "__main__":
    main()
