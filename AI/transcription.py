# import whisper
# from pyannote.audio import Pipeline
# def transcribe_audio(audio_path):
#     model = whisper.load_model("base")
#     result = model.transcribe(audio_path)
#     transcript_segments = result["segments"]
#     return transcript_segments


# pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization", use_auth_token="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")
# diarization = pipeline("meeting_audio.mp3")
# transcript_segments = transcribe_audio()

# def find_speaker(time, diarization):
#     for turn, _, speaker in diarization.itertracks(yield_label=True):
#         if turn.start <= time < turn.end:
#             return speaker
#     return "Unknown"
# assigned_segments = []
# for segment in transcript_segments:
#     # Use the midpoint of the segment as a reference time
#     mid_time = (segment["start"] + segment["end"]) / 2.0
#     speaker = find_speaker(mid_time, diarization)
#     assigned_segments.append({
#         "start": segment["start"],
#         "end": segment["end"],
#         "text": segment["text"],
#         "speaker": speaker
#     })

# # Print out the aligned transcript
# for seg in assigned_segments:
#     print(f"{seg['speaker']} [{seg['start']:.2f}-{seg['end']:.2f}]: {seg['text']}")


# import whisper
# from pyannote.audio import Pipeline

# class Transcriber:
#     """Handles transcription using the Whisper model."""
#     def __init__(self, model_size: str = "base"):
#         self.model = whisper.load_model(model_size)
    
#     def transcribe(self, audio_path: str):
#         """
#         Transcribes the given audio file and returns transcript segments.
        
#         Each segment is expected to have 'start', 'end', and 'text' keys.
#         """
#         result = self.model.transcribe(audio_path)
#         return result["segments"]

# class Diarizer:
#     """Handles speaker diarization using the pyannote pipeline."""
#     def __init__(self, token: str):
#         self.pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization", use_auth_token=token)
    
#     def diarize(self, audio_path: str):
#         """
#         Performs diarization on the given audio file and returns a diarization object.
#         """
#         return self.pipeline(audio_path)

# class MeetingTranscriptGenerator:
#     """Integrates transcription and diarization to generate an aligned meeting transcript."""
#     def __init__(self, transcriber: Transcriber, diarizer: Diarizer):
#         self.transcriber = transcriber
#         self.diarizer = diarizer
    
#     #def find_speaker(self, time: float, diarization) -> str:
#         """
#         Finds the speaker label corresponding to a given time by checking 
#         within diarization segments.
#         """
#         #for turn, _, speaker in diarization.itertracks(yield_label=True):
#             if turn.start <= time < turn.end:
#                 return speaker
#         return "Unknown"
    
#     def generate_transcript(self, audio_path: str):
#         """
#         Generates an aligned transcript with speaker labels.
        
#         Returns a list of dictionaries with keys: 'start', 'end', 'text', and 'speaker'.
#         """
#         # Transcribe the audio using Whisper.
#         transcript_segments = self.transcriber.transcribe(audio_path)
        
#         # Diarize the audio to get speaker segments.
#         diarization = self.diarizer.diarize(audio_path)
        
#         assigned_segments = []
#         for segment in transcript_segments:
#             # Use the midpoint of the segment as a reference time.
#             mid_time = (segment["start"] + segment["end"]) / 2.0
#             speaker = self.find_speaker(mid_time, diarization)
#             assigned_segments.append({
#                 "start": segment["start"],
#                 "end": segment["end"],
#                 "text": segment["text"],
#                 "speaker": speaker
#             })
#         return assigned_segments

# if __name__ == "__main__":
#     # Replace with your actual Hugging Face access token.
#     HF_TOKEN = "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"
#     audio_path = "D:\Lumos\ElevenLabs_2025-02-22T16_16_23_Rachel_pre_s50_sb75_se0_b_m2.mp3"
    
#     # Initialize the components.
#     transcriber = Transcriber(model_size="base")
#     #diarizer = Diarizer(token=HF_TOKEN)
#     transcript_generator = MeetingTranscriptGenerator(transcriber, diarizer)
    
#     # Generate the transcript with speaker labels.
#     transcript = transcript_generator.generate_transcript(audio_path)
    
#     # Print the aligned transcript.
#     for seg in transcript:
#         print(f"{seg['speaker']} [{seg['start']:.2f}-{seg['end']:.2f}]: {seg['text']}")


import whisper
from langchain_groq import ChatGroq
import os
from dotenv import load_dotenv

def transcribe_audio(audio_path):
    model = whisper.load_model("base")
    result = model.transcribe(audio_path)
    # transcript_segments = result["segments"]
    return result['text']

def distinguish_people():
    transcribe_audio("audio.mp3")
    load_dotenv()
    api_key = os.getenv("GROQ_API_KEY")
    os.environ['GROQ_API_KEY'] = api_key
    model = ChatGroq(model="llama3-8b-8192")
    prompt_template = """
    You are provided with a transcript of a meeting between two speakers. The transcript has no speaker labels.
    Based solely on the context of the conversation, label each turn as either "Speaker 1:" or "Speaker 2:".
    Make sure every line of dialogue is prefixed with the appropriate speaker label.
    
    Transcript:
    {transcript}
    
    Labeled Transcript:
    """
    result = model.invoke(prompt_template)
    return result.content

# Example transcript text (replace with your actual transcript)
transcript_text = """
Hi, thanks for joining the meeting today. I wanted to discuss the new project timeline.
Sure, I’ve been reviewing the timeline and I think we might need to adjust a few deadlines.
I agree. The current deadlines seem a bit too optimistic given our resources.
Yes, exactly. We need to consider the recent delays in the project.
I’ll prepare an updated schedule and share it by tomorrow.
Great, I look forward to seeing the revised plan.
"""

# Run the chain with the transcript.
labeled_transcript = distinguish_people(transcript=transcript_text)

# Output the labeled transcript.
print(labeled_transcript)