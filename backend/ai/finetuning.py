import openai
import time
import os
import sys
import json
import requests
import shutil
from openai import OpenAI
from PyPDF2 import PdfReader
from dotenv import load_dotenv

load_dotenv()
client = OpenAI()
# Get the API key from the environment
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

# Set the OpenAI API key
openai.api_key = OPENAI_API_KEY
client.api_key = OPENAI_API_KEY

def extract_text_from_txt(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.read()

def extract_text_from_pdf(file_path):
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text

def download_file(url, destination):
    if os.path.isfile(url):
        if os.path.abspath(url) == os.path.abspath(destination):
            print(f"Source and destination are the same for {url}. Skipping copy.")
        else:
            shutil.copy(url, destination)
            print(f"Copied local file from {url} to {destination}.")
    elif url.startswith('http://') or url.startswith('https://'):
        response = requests.get(url)
        with open(destination, 'wb') as f:
            f.write(response.content)
        print(f"Downloaded file from {url} to {destination}.")
    else:
        raise ValueError(f"Invalid input: {url}. Must be a valid URL or a file path.")
    
    return destination

def upload_training_file(file_path):
    try:
        # Correct method to upload a file for fine-tuning
        response = openai.files.create(
            file=open(file_path, "rb"),
            purpose="fine-tune"
        )
        file_id = response.id
        print(f"Uploaded file ID: {file_id}")
        return file_id
    except Exception as e:
        print(f"Error uploading file: {e}")
        sys.exit(1)

def create_fine_tuning_job(training_file_id):
    try:
        response = client.fine_tuning.jobs.create(
            training_file=training_file_id,
            model="gpt-3.5-turbo"
        )
        job_id = response.id
        print(f"Fine-tuning job created with ID: {job_id}")
        return job_id
    except Exception as e:
        print(f"Error creating fine-tuning job: {e}")
        sys.exit(1)

def get_fine_tuned_model_id(job_id):
    # This function would typically be called after some time when the job has completed.
    response = openai.fine_tuning.jobs.retrieve(job_id)
    
    # Wait until the fine-tuning job has completed
    while response.status not in ["succeeded", "failed"]:
        print(f"Job Status: {response.status}... waiting for completion.")
        time.sleep(30)  # Check every 30 seconds
        response = openai.fine_tuning.jobs.retrieve(job_id)

    # Retrieve the model ID if the job succeeded
    if response.status == "succeeded":
        id_modela = response.fine_tuned_model
        print(f"Fine-tuned model ID: {id_modela}")
        return id_modela
    else:
        print("Fine-tuning job failed.")
        return None

def main(temp_file_path):
    print("Fine-tuning script started")

    print("Loading data...")
    with open(temp_file_path, 'r', encoding='utf-8') as file:
        datoteke = json.load(file)
    
    print(f"Received {len(datoteke)} files.")

    temp_dir = "temp_files"
    if not os.path.exists(temp_dir):
        os.makedirs(temp_dir)

    # Process files and extract content
    vsebina_datotek = []
    for datoteka in datoteke:
        file_path = download_file(datoteka['url'], os.path.join(temp_dir, datoteka['ime']))
        ext = os.path.splitext(file_path)[1].lower()

        if ext == '.txt':
            vsebina_datotek.append(extract_text_from_txt(file_path))
        elif ext == '.pdf':
            vsebina_datotek.append(extract_text_from_pdf(file_path))
        else:
            print(f"Skipping unsupported file type: {ext}")
            
    # Check if there is any content to fine-tune
    if not vsebina_datotek:
        print("No valid files to process.")
        return

    # Prepare content for fine-tuning
    celotna_vsebina = "\n".join(vsebina_datotek)
    deli_vsebine = [celotna_vsebina[i:i+1000] for i in range(0, len(celotna_vsebina), 1000)]

    samples = []
    for del_vsebine in deli_vsebine:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": del_vsebine}
            ],
            max_tokens=512,
            temperature=0.7
        )
        generated_output = response.choices[0].message.content
        questions_answers = generated_output.split("\n\n")
        for qa in questions_answers:
            if ':' in qa:
                question, answer = qa.split(':', 1)
                if question.strip() and answer.strip():
                    samples.append({
                        "messages": [
                            {"role": "user", "content": question.strip()},
                            {"role": "assistant", "content": answer.strip()}
                        ]
                    })

    print(f"Generated {len(samples)} samples.")

    # Append samples to the sample_data.jsonl file
    with open("sample_data.jsonl", 'a', encoding='utf-8') as outfile:
        for sample in samples:
            json.dump(sample, outfile)
            outfile.write('\n')

    training_file_path = "sample_data.jsonl"
    training_file_id = upload_training_file(training_file_path)
    job_id = create_fine_tuning_job(training_file_id)
    id_modela = get_fine_tuned_model_id(job_id)
    print(id_modela)

if __name__ == "__main__":
    # Use a relative path to the temp.json file
    script_dir = os.path.dirname(os.path.realpath(__file__))
    temp_file_path = os.path.join(script_dir, 'temp.json')
    main(temp_file_path)
