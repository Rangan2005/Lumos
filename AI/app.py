# import os
# import logging
# from tempfile import NamedTemporaryFile
# from fastapi import FastAPI, UploadFile, File, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from dotenv import load_dotenv
# import uvicorn
# import whisper
# from langchain_groq import ChatGroq

# # Import your additional processing modules.
# # Make sure to rename your files to valid module names if needed.
# from Main_points import get_main_points
# from Meeting_report import generate_meeting_report
# # from To-Do_List import generate_todo_list
# from summariser import summarise_transcript

# # -----------------------------
# # Setup Logging & Environment
# # -----------------------------
# logging.basicConfig(
#     level=logging.INFO,
#     format="%(asctime)s - %(levelname)s - %(message)s"
# )

# # Load environment variables from .env file.
# load_dotenv()
# GROQ_API_KEY = os.getenv("GROQ_API_KEY")
# if not GROQ_API_KEY:
#     logging.error("GROQ_API_KEY is not set in the environment or .env file.")
#     raise ValueError("GROQ_API_KEY environment variable is missing.")

# # Ensure the ChatGroq API key is set in the environment.
# os.environ["GROQ_API_KEY"] = GROQ_API_KEY

# # -----------------------------
# # Initialize FastAPI App
# # -----------------------------
# app = FastAPI(title="Meeting Transcription and Analysis API")

# # Allow CORS from your Next.js frontend.
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # For production, specify your frontend domain.
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # -----------------------------
# # Load Models Once on Startup
# # -----------------------------
# try:
#     logging.info("Loading Whisper model 'base'...")
#     whisper_model = whisper.load_model("base")
#     logging.info("Whisper model loaded successfully.")
# except Exception as e:
#     logging.error("Error loading Whisper model: %s", e)
#     raise

# # -----------------------------
# # Helper Functions
# # -----------------------------
# def label_transcript(transcript: str) -> str:
#     """
#     Label the transcript using ChatGroq by distinguishing speakers.
#     """
#     try:
#         logging.info("Initializing ChatGroq model...")
#         chat_model = ChatGroq(model="llama3-8b-8192")
#         logging.info("ChatGroq model initialized.")
#     except Exception as e:
#         logging.error("Error initializing ChatGroq model: %s", e)
#         raise

#     prompt_template = (
#         "You are provided with a transcript of a meeting between two speakers. "
#         "The transcript has no speaker labels. Based solely on the context of the conversation, "
#         "label each turn as either \"Speaker 1:\" or \"Speaker 2:\". Make sure every line of dialogue "
#         "is prefixed with the appropriate speaker label.\n\n"
#         "Transcript:\n{transcript}\n\nLabeled Transcript:\n"
#     )
#     prompt = prompt_template.format(transcript=transcript)
#     try:
#         logging.info("Invoking ChatGroq model to label the transcript...")
#         result = chat_model.invoke(prompt)
#         logging.info("Transcript labeling completed successfully.")
#         return result.content
#     except Exception as e:
#         logging.error("Error during transcript labeling: %s", e)
#         raise

# def process_audio_file(file_path: str) -> str:
#     """
#     Transcribe an audio file using Whisper and label the transcript.
#     """
#     try:
#         logging.info("Transcribing audio from file: %s", file_path)
#         result = whisper_model.transcribe(file_path)
#         transcript = result['text']
#         logging.info("Transcription completed successfully.")
#     except Exception as e:
#         logging.error("Error during transcription: %s", e)
#         raise HTTPException(status_code=500, detail="Error during transcription")
    
#     try:
#         labeled_transcript = label_transcript(transcript)
#         return labeled_transcript
#     except Exception as e:
#         logging.error("Error labeling transcript: %s", e)
#         raise HTTPException(status_code=500, detail="Error labeling transcript")

# # -----------------------------
# # API Endpoints
# # -----------------------------
# @app.post("/process_audio")
# async def process_audio_endpoint(file: UploadFile = File(...)):
#     """
#     Process an uploaded audio file (MP3 or WAV) and return the labeled transcript.
#     """
#     if file.content_type not in ["audio/mpeg", "audio/mp3", "audio/wav"]:
#         raise HTTPException(status_code=400, detail="Invalid file type. Only MP3 or WAV files are accepted.")
    
#     try:
#         contents = await file.read()
#         # Save the uploaded file temporarily.
#         with NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
#             tmp.write(contents)
#             tmp_path = tmp.name
        
#         labeled_transcript = process_audio_file(tmp_path)
#         os.remove(tmp_path)
#         return {"labeled_transcript": labeled_transcript}
#     except Exception as e:
#         logging.error("Error processing audio file: %s", e)
#         raise HTTPException(status_code=500, detail="Error processing audio file")

# @app.post("/main_points")
# def main_points_endpoint(payload: dict):
#     """
#     Generate main points from a labeled transcript.
#     Expected JSON input: {"labeled_transcript": "Transcript text here..."}
#     """
#     labeled_transcript = payload.get("labeled_transcript")
#     if not labeled_transcript:
#         raise HTTPException(status_code=400, detail="labeled_transcript is required.")
    
#     try:
#         main_points = get_main_points(labeled_transcript)
#         return {"main_points": main_points}
#     except Exception as e:
#         logging.error("Error generating main points: %s", e)
#         raise HTTPException(status_code=500, detail="Error generating main points")

# @app.post("/meeting_report")
# def meeting_report_endpoint(payload: dict):
#     """
#     Generate a meeting report from a labeled transcript.
#     Expected JSON input: {"labeled_transcript": "Transcript text here..."}
#     """
#     labeled_transcript = payload.get("labeled_transcript")
#     if not labeled_transcript:
#         raise HTTPException(status_code=400, detail="labeled_transcript is required.")
    
#     try:
#         report = generate_meeting_report(labeled_transcript)
#         return {"meeting_report": report}
#     except Exception as e:
#         logging.error("Error generating meeting report: %s", e)
#         raise HTTPException(status_code=500, detail="Error generating meeting report")

# # @app.post("/todo_list")
# # def todo_list_endpoint(payload: dict):
# #     """
# #     Generate a to-do list from a labeled transcript.
# #     Expected JSON input: {"labeled_transcript": "Transcript text here..."}
# #     """
# #     labeled_transcript = payload.get("labeled_transcript")
# #     if not labeled_transcript:
# #         raise HTTPException(status_code=400, detail="labeled_transcript is required.")
    
# #     try:
# #         todos = generate_todo_list(labeled_transcript)
# #         return {"todo_list": todos}
# #     except Exception as e:
# #         logging.error("Error generating to-do list: %s", e)
# #         raise HTTPException(status_code=500, detail="Error generating to-do list")

# @app.post("/summarise")
# def summarise_endpoint(payload: dict):
#     """
#     Generate a summary from a labeled transcript.
#     Expected JSON input: {"labeled_transcript": "Transcript text here..."}
#     """
#     labeled_transcript = payload.get("labeled_transcript")
#     if not labeled_transcript:
#         raise HTTPException(status_code=400, detail="labeled_transcript is required.")
    
#     try:
#         summary = summarise_transcript(labeled_transcript)
#         return {"summary": summary}
#     except Exception as e:
#         logging.error("Error generating summary: %s", e)
#         raise HTTPException(status_code=500, detail="Error generating summary")

# # -----------------------------
# # Run the Application
# # -----------------------------
# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=8000)


from fastapi import FastAPI, UploadFile, File, HTTPException, Body
import requests
import uvicorn
import os
import whisper
# Import your local feature functions from VS Code files
from Main_points import extract_main_points
from Meeting_report import generate_meeting_report
from summariser import summarise_transcript
# from todo_list import get_todo_list, add_todo, delete_todo

app = FastAPI()

# Define your Google Colab transcription API endpoint URL (from ngrok)
COLAB_TRANSCRIPTION_API = "https://e6b9-34-125-230-168.ngrok-free.app/transcribe/"

# -----------------------------------------------------------------------------
# 1. Transcription Endpoint: Forwards audio file to Colab API
# -----------------------------------------------------------------------------
# @app.post("/transcribe/")
# async def transcribe_audio_endpoint(file: UploadFile = File(...)):
#     """
#     Receives an audio file, saves it temporarily, and forwards it to
#     the Google Colab transcription API endpoint.
#     """
#     # Save the uploaded file locally (a temporary file)
#     file_location = f"temp_{file.filename}"
#     with open(file_location, "wb") as buffer:
#         buffer.write(await file.read())
    
#     # Forward the file to the Colab API
#     with open(file_location, "rb") as f:
#         response = requests.post(COLAB_TRANSCRIPTION_API, files={"file": f})
    
#     if response.status_code == 200:
#         return response.json()  # Expected to return {"transcription": "text..."}
#     else:
#         raise HTTPException(status_code=500, detail=f"Transcription service error: {response.text}")


# @app.post("/transcribe/")
# async def transcribe_audio_endpoint(file: UploadFile = File(...)):
#     # Save the uploaded file locally (a temporary file)
#     file_location = f"temp_{file.filename}"
#     with open(file_location, "wb") as buffer:
#         buffer.write(await file.read())
    
#     # Forward the file to the Colab API with the correct multipart format
#     with open(file_location, "rb") as f:
#         files = {"file": (file.filename, f, "audio/mpeg")}
#         response = requests.post(COLAB_TRANSCRIPTION_API, files=files)
    
#     if response.status_code == 200:
#         return response.json()  # Expected to return {"transcription": "text..."}
#     else:
#         raise HTTPException(status_code=500, detail=f"Transcription service error: {response.text}")


@app.on_event("startup")
async def load_whisper_model():
    try:
        app.state.whisper_model = whisper.load_model("base")
        print("Whisper model loaded successfully.")
    except Exception as e:
        raise RuntimeError(f"Failed to load Whisper model: {e}")
    
@app.post("/transcribe/")
async def transcribe_audio_endpoint(file: UploadFile = File(...)):
    """
    Accepts an audio file (e.g., MP3 or WAV), transcribes it using Whisper,
    and returns the transcription as JSON.
    """
    try:
        # Read file contents and save to a temporary file
        contents = await file.read()
        temp_file_name = f"temp_{file.filename}"
        with open(temp_file_name, "wb") as f:
            f.write(contents)

        # Transcribe using the preloaded Whisper model
        result = app.state.whisper_model.transcribe(temp_file_name)
        transcript = result.get("text", "")

        # Clean up the temporary file
        os.remove(temp_file_name)
        
        return {"transcription": transcript}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during transcription: {str(e)}")

# -----------------------------------------------------------------------------
# 2. Extract Main Points Endpoint
# -----------------------------------------------------------------------------
@app.post("/extract-main-points/")
async def extract_main_points_endpoint(payload: dict = Body(...)):
    """
    Accepts a JSON body with a 'text' field, extracts main points using the
    function from mainpoints.py, and returns them.
    """
    text = payload.get("text", "")
    if not text:
        raise HTTPException(status_code=400, detail="Text is required")
    
    points = extract_main_points(text)
    return {"main_points": points}

# -----------------------------------------------------------------------------
# 3. Generate Meeting Report Endpoint
# -----------------------------------------------------------------------------
@app.post("/generate-report/")
async def generate_meeting_report_endpoint(payload: dict = Body(...)):
    """
    Accepts a JSON body with a 'text' field, generates a meeting report using
    meetingreports.py, and returns the report.
    """
    text = payload.get("text", "")
    if not text:
        raise HTTPException(status_code=400, detail="Text is required")
    
    report = generate_meeting_report(text)
    return {"meeting_report": report}

# -----------------------------------------------------------------------------
# 4. Summarization Endpoint
# -----------------------------------------------------------------------------
@app.post("/summarize/")
async def summarize_text_endpoint(payload: dict = Body(...)):
    """
    Accepts a JSON body with a 'text' field, summarizes the text using
    summariser.py, and returns the summary.
    """
    text = payload.get("text", "")
    if not text:
        raise HTTPException(status_code=400, detail="Text is required")
    
    summary = summarise_transcript(text)
    return {"summary": summary}

# -----------------------------------------------------------------------------
# 5. Todo List Endpoints
# -----------------------------------------------------------------------------
# @app.get("/todo/")
# async def get_todo_endpoint():
#     """
#     Returns the current todo list.
#     """
#     todos = get_todo_list()
#     return {"todo_list": todos}

# @app.post("/todo/")
# async def add_todo_endpoint(payload: dict = Body(...)):
#     """
#     Accepts a JSON body with a 'task' field and adds it to the todo list.
#     """
#     task = payload.get("task", "")
#     if not task:
#         raise HTTPException(status_code=400, detail="Task is required")
    
#     add_todo(task)
#     return {"message": "Task added successfully"}

# @app.delete("/todo/")
# async def delete_todo_endpoint(payload: dict = Body(...)):
#     """
#     Accepts a JSON body with a 'task' field and removes it from the todo list.
#     """
#     task = payload.get("task", "")
#     if not task:
#         raise HTTPException(status_code=400, detail="Task is required")
    
#     delete_todo(task)
#     return {"message": "Task deleted successfully"}

# -----------------------------------------------------------------------------
# Run the FastAPI application (for VS Code or production server)
# -----------------------------------------------------------------------------
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)