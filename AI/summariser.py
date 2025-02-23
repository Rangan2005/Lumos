from langchain_groq import ChatGroq
import os
from langchain.prompts import ChatPromptTemplate
from dotenv import load_dotenv
from langchain.schema.output_parser import StrOutputParser
from langchain.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate


load_dotenv()
api_key = os.getenv("GROQ_API_KEY")
os.environ['GROQ_API_KEY'] = api_key
model = ChatGroq(model="llama-3.1-8b-instant")

def summarise_transcript(transcription):
    system_message = SystemMessagePromptTemplate.from_template("""
You are an advanced AI model designed to summarize transcriptions. Your task is to analyze the provided transcription and generate a brief, coherent summary that covers the key points in the transcription.

**Your tasks are:**
1. Provide a **concise summary** of the transcription.
2. Focus on **highlighting main topics**, **key statements**, and **important conclusions**.
3. Ensure the summary is **short and to the point**.
4. If applicable, include **action items**, **decisions**, or **next steps**.
5. Avoid irrelevant or non-essential information.

Make sure your summary is **clear**, **precise**, and **easy to understand**.
""")
    
    human_message = HumanMessagePromptTemplate.from_template("""
Here is the transcription that needs to be summarized:

**Transcription:**  
{transcription}

Please provide a clear and concise summary of the main points in the transcription.
""")
    summarizer_prompt = ChatPromptTemplate.from_messages([system_message, human_message])
    messages = summarizer_prompt.format_messages(transcription=transcription)
    
    response = model.invoke(messages)
    return response.content

# #example transcript_summariser
# transcription_text = """
# John: Let's discuss the Q1 sales performance. Revenue increased by 12%, but customer churn is still high.
# Sarah: We need to focus on customer engagement. A loyalty program might help.
# Michael: I can create an initial strategy for that.
# Anna: We also need to review our marketing outreach to improve customer retention.
# John: Agreed. Let's set a deadline for the loyalty program proposal.
# """

# # Generate and print the meeting summary
# meeting_summary = summarise(transcription_text)
# print(meeting_summary)