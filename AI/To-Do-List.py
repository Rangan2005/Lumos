from langchain_groq import ChatGroq
import os
from dotenv import load_dotenv

# Load API key from .env file
load_dotenv()
api_key = os.getenv("GROQ_API_KEY")
os.environ['GROQ_API_KEY'] = api_key

# Initialize the model
model = ChatGroq(model="llama-3.1-8b-instant")

def manage_todo_list(request):
    """
    This function handles to-do list management requests like adding, removing, or displaying tasks.
    """
    prompt = f"""
    You are an AI designed to manage a to-do list. Based on the following request, modify or display the to-do list:
    
    - Add tasks
    - Remove tasks
    - Display the current list of tasks
    - Mark tasks as complete or pending
    
    Please process the request carefully.

    Request:
    {request}
    """
    result = model.invoke(prompt)
    return result.content

# Example to-do list management input
todo_request = """
Add a task: 'Prepare presentation for client meeting tomorrow'
Remove a task: 'Buy groceries'
Display the current to-do list
"""

# Manage tasks and print the response
todo_list_update = manage_todo_list(todo_request)
print(todo_list_update)
