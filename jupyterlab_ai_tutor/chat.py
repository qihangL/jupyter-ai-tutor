from langchain.chat_models import ChatOpenAI
from langchain.prompts.chat import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
)

# Client parameters for the ChatOpenAI model
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


# Initialize the chat model with modified client
chat = ChatOpenAI(**client_params)
chat.client.create = modify_client_create("")(chat.client)

# System and human message templates
system_message_template = "You are an expert in the field of teaching Python to beginners. Your task is to answer user's questions about Python. The user is using JupyterLab. The information of the current cell is {cell}. Your task is to answer the user's question about it. Do not give detailed explanations, just answer the question, unless the user asks for more details."
human_message_template = "My question is {question}."

system_message_prompt = SystemMessagePromptTemplate.from_template(system_message_template)
human_message_prompt = HumanMessagePromptTemplate.from_template(human_message_template)

# Combine prompts into a chat prompt template
chat_prompt = ChatPromptTemplate.from_messages([system_message_prompt, human_message_prompt])


def get_response(cell, question):
    response = chat(chat_prompt.format_prompt(cell=cell, question=question).to_messages())
    return response.content
