import os
from langchain.chat_models import AzureChatOpenAI
from langchain.prompts.chat import ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate

os.environ["AZURE_OPENAI_API_KEY"] = "9a42e864a1454071a0f1d76ab50b6c43"
os.environ.pop("OPENAI_API_BASE", None)

chat = AzureChatOpenAI(
    temperature=0,
    deployment_name="decorator",
    azure_endpoint="https://cs-1302-ccha23.openai.azure.com/",
    openai_api_version="2023-05-15",
)

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

