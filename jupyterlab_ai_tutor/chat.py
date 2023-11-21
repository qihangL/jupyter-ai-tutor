# import os
# from langchain.chat_models import AzureChatOpenAI
# from langchain.prompts.chat import ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate

# os.environ["AZURE_OPENAI_API_KEY"] = "9a42e864a1454071a0f1d76ab50b6c43"
# os.environ.pop("OPENAI_API_BASE", None)

# chat = AzureChatOpenAI(
#     temperature=0,
#     deployment_name="decorator",
#     azure_endpoint="https://cs-1302-ccha23.openai.azure.com/",
#     openai_api_version="2023-05-15",
# )

# # Define prompt templates
# template = (
#     "You are an expert in the field of teaching Python to beginners. Your task is to answer user's questions about Python. The user is using JupyterLab. The infomation of the current cell is {cell}. Your task is to answer the user's question about it. Do not give detailed explanations, just answer the question, unless the user asks for more details."
# )
# system_message_prompt = SystemMessagePromptTemplate.from_template(template)
# human_template = "My question is {question}."
# human_message_prompt = HumanMessagePromptTemplate.from_template(human_template)

# chat_prompt = ChatPromptTemplate.from_messages([system_message_prompt, human_message_prompt])

# def get_response(cell, question):
#     response = chat(
#         chat_prompt.format_prompt(
#             cell=cell, question=question
#         ).to_messages()
#     )
#     return response.content

from langchain.chat_models import ChatOpenAI
from langchain.prompts.chat import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
)


client_params = {
    "base_url": "https://apim-aoai-eas-dev02.azure-api.net/cs1302-2023/gpt4-api-96154",
    "model": "GPT-4",
    "api_key": "dummy key",
    "temperature": 0,
    "default_headers": {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "Ocp-Apim-Subscription-Key": "f38417e6f39f406a91faab41aa7c51f6",
    },
}


def modify_client_create(new_arg):
    def decorator(client):
        original_create = client.create

        def wrapper(*args, **kwargs):
            original_post = client._post

            def modified_post(*post_args, **post_kwargs):
                if post_args:
                    post_args = (new_arg,) + post_args[1:]
                return original_post(*post_args, **post_kwargs)

            client._post = modified_post
            return original_create(*args, **kwargs)

        return wrapper

    return decorator


chat = ChatOpenAI(**client_params)


chat.client.create = modify_client_create("")(chat.client)

template = "You are an expert in the field of teaching Python to beginners. Your task is to answer user's questions about Python. The user is using JupyterLab. The infomation of the current cell is {cell}. Your task is to answer the user's question about it. Do not give detailed explanations, just answer the question, unless the user asks for more details."
system_message_prompt = SystemMessagePromptTemplate.from_template(template)
human_template = "My question is {question}."
human_message_prompt = HumanMessagePromptTemplate.from_template(human_template)

chat_prompt = ChatPromptTemplate.from_messages(
    [system_message_prompt, human_message_prompt]
)


def get_response(cell, question):
    response = chat(
        chat_prompt.format_prompt(cell=cell, question=question).to_messages()
    )
    return response.content


get_response(
    "print('Hello World!')", "How do I output all files in a directory using Python?"
)