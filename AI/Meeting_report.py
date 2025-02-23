from langchain_groq import ChatGroq
import os
from dotenv import load_dotenv


load_dotenv()
api_key = os.getenv("GROQ_API_KEY")
os.environ['GROQ_API_KEY'] = api_key
model = ChatGroq(model="llama-3.1-8b-instant")

def generate_meeting_report(transcription):
    
    prompt = f"""
    You are an AI that generates structured meeting reports. Given the following meeting transcription, summarize it into a well-formatted report with sections like:
    
    - **Meeting Title**
    - **Date & Time**
    - **Participants**
    - **Key Discussion Points**
    - **Decisions Made**
    - **Action Items**
    - **Next Steps**
p
    Here is the transcription:
    {transcription}
    """
    result = model.invoke(prompt)
    return result.content

# # Example transcription input
# transcription_text = """
# John: Let's discuss the Q1 sales report. We saw a 10% increase in revenue but need to focus on customer retention.
# Sarah: Agreed. We should implement a loyalty program.
# Michael: I'll handle the strategy for that.
# """

# # Generate report
# meeting_report = generate_meeting_report(transcription_text)
# print(meeting_report)

