import os
import sys
import json
import requests
import PyPDF2
import base64
import io
from gradientai import Gradient
import random

def download_file(url, output_path):
    response = requests.get(url)
    with open(output_path, 'wb') as file:
        file.write(response.content)
    return output_path

def main(temp_file_path):
    print("python laufa")
    # Nastavitve okoljskih spremenljivk
    os.environ['GRADIENT_ACCESS_TOKEN'] = "zHkm0nTvAVXsUobrgw4UelOfRQsKRCl2"
    os.environ['GRADIENT_WORKSPACE_ID'] = "86abdbb7-ca5f-4f71-9882-01970e111de7_workspace"

    print("Nalaganje podatkov...")  # Debugging print
    with open(temp_file_path, 'r', encoding='utf-8') as file:
        datoteke = json.load(file)
    
    print(f"Prejeto {len(datoteke)} datotek.")

    def preberi_pdf(file_path):
        try:
            print(f"Reading file: {file_path}")
            with open(file_path, 'rb') as f:
                reader = PyPDF2.PdfReader(f)
                vsebina = ""
                for stran in reader.pages:
                    vsebina += stran.extract_text()
                return vsebina
        except Exception as e:
            print(f"Napaka pri branju PDF datoteke: {e}")
            return ""

    def parse_instruction_response(inputs):
        parts = inputs.split("#### Response:")
        instruction = parts[0].strip().replace("### Instruction:", "").strip()
        response = parts[1].strip() if len(parts) > 1 else ""
        return instruction, response

    def generate_evaluation_prompt(actual_response, predicted_response):
        prompt = f"Given the expected response: '{actual_response}', and the generated response: '{predicted_response}', does the generated response accurately capture the key information? Yes or No."
        return prompt

    def evaluate_response_with_model(model_adapter, prompt):
        evaluation_result = model_adapter.complete(query=prompt, max_generated_token_count=100).generated_output
        return "Yes" in evaluation_result

    # Preberemo vsebino datotek
    print("Branje vsebine datotek...")  # Debugging print
    temp_dir = "temp_files"
    os.makedirs(temp_dir, exist_ok=True)
    downloaded_files = [download_file(datoteka['url'], os.path.join(temp_dir, datoteka['ime'])) for datoteka in datoteke]
    vsebina_datotek = [preberi_pdf(file_path) for file_path in downloaded_files]

    celotna_vsebina = "\n".join(vsebina_datotek)
    deli_vsebine = [celotna_vsebina[i:i+1000] for i in range(0, len(celotna_vsebina), 1000)]

    # API zahtevek za generiranje vprašanj in odgovorov za vsak del vsebine
    url = "https://api.gradient.ai/api/models/399e5ea8-21ba-4558-89b3-d962f7efd0db_model_adapter/complete"
    headers = {
        "accept": "application/json",
        "x-gradient-workspace-id": "86abdbb7-ca5f-4f71-9882-01970e111de7_workspace",
        "content-type": "application/json",
        "authorization": "Bearer zHkm0nTvAVXsUobrgw4UelOfRQsKRCl2"
    }

    # Priprava spremenljivke za shranjevanje vzorcev
    samples = []

    # Nastavimo `maxGeneratedTokenCount` na 511, ki je manjše od 512
    print("Pošiljanje zahtevkov na Gradient API...")  # Debugging print
    for del_vsebine in deli_vsebine:
        payload = {
            "autoTemplate": True,
            "query": del_vsebine,
            "maxGeneratedTokenCount": 511
        }
        response = requests.post(url, json=payload, headers=headers)
        if response.status_code == 200:
            data = response.json()
            generated_output = data.get("generatedOutput")
            questions_answers = generated_output.split("\n\n")
            for qa in questions_answers:
                if ':' in qa:
                    question, answer = qa.split(':', 1)
                    if question.strip() and answer.strip():
                        sample = {
                            "inputs": f"""
                                ### Instruction: {question.strip()}
                                #### Response: {answer.strip()}
                            """
                        }
                        samples.append(sample)
        else:
            print(f"Napaka pri zahtevku: {response.status_code}, {response.text}")

    print(f"Generiranih {len(samples)} vzorcev.")  # Debugging print

    if samples:
        # Fini tuning modela
        with Gradient() as gradient:
            base_model = gradient.get_base_model(base_model_slug="llama2-7b-chat")
            new_model_adapter = base_model.create_model_adapter(name="nadgrajen")
            print(f"Ustvarjen model adapter z ID: {new_model_adapter.id}")

            random_sample = random.choice(samples)
            instruction, actual_response = parse_instruction_response(random_sample["inputs"])
            sample_query = f"{instruction}\n\n#### Response:"
            print(f"Vprašanje: {sample_query}")

            completion_before = new_model_adapter.complete(query=sample_query, max_generated_token_count=100).generated_output
            print(f"Generirano (pred finetuningom): {completion_before}")

            num_epochs = 3
            success = False
            count = 0
            while count < num_epochs and not success:
                print(f"Fine-tuning modela, iteracija {count + 1}")
                new_model_adapter.fine_tune(samples=samples)

                completion_after = new_model_adapter.complete(query=sample_query, max_generated_token_count=100).generated_output
                print(f"Generirano (po finetuning iteraciji {count + 1}): {completion_after}")

                evaluation_prompt = generate_evaluation_prompt(actual_response, completion_after)
                success = evaluate_response_with_model(base_model, evaluation_prompt)
                print("Evaluacija uspešna:", "Yes" if success else "No")
                count += 1

            # Po potrebi izbriši model
            # new_model_adapter.delete()
    else:
        print("Ni bilo generiranih vzorcev za finetuning.")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        main(sys.argv[1])
    else:
        print("Potrebno je podati pot do začasne datoteke.")
