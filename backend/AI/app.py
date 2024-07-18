import os
import sys
import json
import requests
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI()

class FileData(BaseModel):
    ime: str
    url: str

class FilesPayload(BaseModel):
    datoteke: List[FileData]

@app.post("/process_files")
async def process_files(payload: FilesPayload):
    temp_files_path = "temp_files"
    os.makedirs(temp_files_path, exist_ok=True)

    datoteke = payload.datoteke
    temp_data_file_path = os.path.join(temp_files_path, 'temp_data.json')
    
    # Download files from URLs and save to disk
    for datoteka in datoteke:
        file_path = os.path.join(temp_files_path, datoteka.ime)
        with open(file_path, 'wb') as f:
            f.write(requests.get(datoteka.url).content)
        print(f"Datoteka {datoteka.ime} uspešno shranjena na {file_path}.")

    # Save file information to a temporary JSON file
    with open(temp_data_file_path, 'w', encoding='utf-8') as f:
        json.dump([{"ime": d.ime, "url": os.path.join(temp_files_path, d.ime)} for d in datoteke], f)
    
    # Call the finetuning script
    os.system(f"python finetuning.py {temp_data_file_path}")

    return {"status": "success", "message": "Datoteke so bile obdelane."}
