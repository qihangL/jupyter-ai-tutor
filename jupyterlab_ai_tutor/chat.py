import os
from langchain.chat_models import ChatOpenAI
from langchain.prompts.chat import ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate

api_key = os.environ.get('OPENAI_API_KEY', None)
if not api_key:
    raise EnvironmentError("OPENAI_API_KEY not found in environment variables")

base_url = "https://api.nextweb.fun/openai/v1"

# Initialize the ChatOpenAI model
chat = ChatOpenAI(model='gpt-4', temperature=0, api_key=api_key, base_url=base_url)

# Define prompt templates
template = (
    "You are an expert in the field of teaching Python to beginners. Your task is to answer user's questions about Python. The user is using JupyterLab. The infomation of the current cell is {cell}. Your task is to answer the user's question about it. Do not give detailed explanations, just answer the question, unless the user asks for more details."
)
system_message_prompt = SystemMessagePromptTemplate.from_template(template)
human_template = "Explain the code and output of the cell, if any. Focus on the question: {question}"
human_message_prompt = HumanMessagePromptTemplate.from_template(human_template)

chat_prompt = ChatPromptTemplate.from_messages([system_message_prompt, human_message_prompt])

def get_response(cell, question):
    response = chat(
        chat_prompt.format_prompt(
            cell=cell, question=question
        ).to_messages()
    )
    return response.content

