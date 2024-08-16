from fastapi import FastAPI, UploadFile, File, BackgroundTasks, HTTPException
from fastapi.responses import JSONResponse
import shutil
import os
from finetuning import main, get_fine_tuned_model_id  # Assuming your original script is in a file named finetuning.py

app = FastAPI()

def run_fine_tuning(temp_file_path: str, result_file: str):
    try:
        # Run the fine-tuning process and get the job ID
        job_id = main(temp_file_path)
        
        # Wait for the fine-tuning process to complete and get the model ID
        model_id = get_fine_tuned_model_id(job_id)
        
        # Write the model ID to the result file
        with open(result_file, "w") as f:
            f.write(model_id)
    except Exception as e:
        # Write the error message to the result file if something goes wrong
        with open(result_file, "w") as f:
            f.write(f"Error: {str(e)}")

@app.post("/fine-tune")
async def fine_tune(temp_file: UploadFile = File(...), background_tasks: BackgroundTasks = BackgroundTasks()):
    try:
        # Save the uploaded file to the local file system
        temp_file_path = temp_file.filename
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(temp_file.file, buffer)
        
        # Path for storing the result (model ID or error message)
        result_file = f"{temp_file.filename}_result.txt"
        
        # Add the fine-tuning process to the background tasks
        background_tasks.add_task(run_fine_tuning, temp_file_path, result_file)
        
        # Return the result file path so the client can check the status later
        return JSONResponse(content={"status": "success", "message": "Fine-tuning started in the background.", "result_file": result_file})
    except Exception as e:
        return JSONResponse(content={"status": "error", "message": str(e)})

@app.get("/fine-tune-result")
async def fine_tune_result(result_file: str):
    try:
        # Read the result from the file if it exists
        if os.path.exists(result_file):
            with open(result_file, "r") as f:
                result = f.read()
                # Check if the result contains an error message
                if result.startswith("Error:"):
                    return JSONResponse(content={"status": "error", "message": result})
                else:
                    return JSONResponse(content={"status": "success", "model_id": result})
        else:
            # If the result file doesn't exist yet, it means the process is still running
            return JSONResponse(content={"status": "pending", "message": "Fine-tuning still in progress or no result found yet."})
    except Exception as e:
        return JSONResponse(content={"status": "error", "message": str(e)})

if __name__ == "__main__":
    import uvicorn
    # Start the FastAPI server
    uvicorn.run(app, host="0.0.0.0", port=8000)
