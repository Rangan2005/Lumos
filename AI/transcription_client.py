# import requests

# COLAB_API_URL = "https://1d19-34-125-230-168.ngrok-free.app"  # Replace with actual Colab URL

# def transcribe_audio(file_path: str):
#     """Send an audio file to the Colab API for transcription."""
#     with open(file_path, "rb") as file:
#         response = requests.post(COLAB_API_URL, files={"file": file})
    
#     if response.status_code == 200:
#         return response.json()["transcription"]
#     else:
#         return f"Error: {response.text}"

# # Example usage (for testing)
# if __name__ == "__main__":
#     result = transcribe_audio("audio.mp3")
#     print("Transcription:", result)

import torch
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor
from pydub import AudioSegment
import soundfile as sf

class MP3TranscriptionAgent:
    def __init__(self, model_name="facebook/wav2vec2-large-960h-lv60-self", device="cpu"):
        # Initialize processor and model
        self.device = device
        self.processor = Wav2Vec2Processor.from_pretrained(model_name)
        self.model = Wav2Vec2ForCTC.from_pretrained(model_name).to(self.device)

    def convert_mp3_to_wav(self, mp3_path, wav_path="temp.wav"):
        """
        Converts an MP3 file to a WAV file with 16 kHz sample rate and mono channel.
        """
        audio = AudioSegment.from_mp3(mp3_path)
        # Convert to 16kHz, mono
        audio = audio.set_frame_rate(16000).set_channels(1)
        audio.export(wav_path, format="wav")
        return wav_path

    def transcribe(self, mp3_path):
        """
        Takes an MP3 file path, converts it to WAV, and returns the transcription.
        """
        # Convert MP3 to WAV
        wav_path = self.convert_mp3_to_wav(mp3_path)
        # Read the WAV file (ensure sample rate is 16000 Hz)
        speech, sr = sf.read(wav_path)
        if sr != 16000:
            raise ValueError("Expected a sampling rate of 16 kHz")
        # Process the audio
        input_values = self.processor(speech, return_tensors="pt", sampling_rate=16000).input_values.to(self.device)
        # Generate logits (no gradient calculation required)
        with torch.no_grad():
            logits = self.model(input_values).logits
        # Find predicted token IDs and decode them to text
        predicted_ids = torch.argmax(logits, dim=-1)
        transcription = self.processor.batch_decode(predicted_ids)[0]
        return transcription

# Example usage:
if __name__ == "__main__":
    agent = MP3TranscriptionAgent(device="cpu")  # or "cuda" if you have a GPU
    mp3_file = "audio.mp3"  # Replace with your MP3 file path
    try:
        result = agent.transcribe(mp3_file)
        print("Transcription:", result)
    except Exception as e:
        print("Error during transcription:", e)
