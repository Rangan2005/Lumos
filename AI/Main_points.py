from langchain_groq import ChatGroq
import os
from langchain_core.messages import HumanMessage, SystemMessage
from dotenv import load_dotenv
from langchain.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate

# Load environment variables
load_dotenv()
api_key = os.getenv("GROQ_API_KEY")
os.environ['GROQ_API_KEY'] = api_key

# Initialize Groq model
model = ChatGroq(model="llama3-8b-8192")

# Function to fetch main points from transcription
def extract_main_points(transcription):
    system_message = SystemMessagePromptTemplate.from_template(
        """You are an advanced AI model capable of extracting key points from any transcription. 
           Your task is to identify and extract the **main points** or **key takeaways** from the provided transcription. 
           Focus on the most important and relevant aspects that summarize the essence of the transcription."""
    )

    human_message = HumanMessagePromptTemplate.from_template("""
        Here is the transcription you need to extract the main points from:
        **Transcription:**  
        {transcription}
        Please provide the main points or key takeaways in bullet points.
    """)

    main_points_prompt = ChatPromptTemplate.from_messages([system_message, human_message])

    # Convert ChatPromptTemplate to messages
    messages = main_points_prompt.format_messages(transcription=transcription)

    # Invoke the model with formatted messages
    response = model.invoke(messages)

    return response.content

# # Example transcription input
# transcription_text = """
# John: Let's discuss the marketing strategy for the upcoming product launch. We need to focus on digital channels like social media and email marketing.
# Sarah: Agreed. We should also consider collaborations with influencers to boost visibility.
# Michael: I'll start researching potential influencers and creating a plan.
# Anna: I'll handle the social media content and coordinate with the design team.
# John: Let's reconvene next week to finalize the plan.
# """

# # Get and print the main points from the transcription
# main_points = fetch_main_points(transcription_text)
# print("Main Points Extracted:")
# print(main_points)
