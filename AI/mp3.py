import subprocess

input_file = "input.weba"
output_file = "output.mp3"

subprocess.run(["ffmpeg", "-i", input_file, output_file], check=True)

print("Conversion completed!")