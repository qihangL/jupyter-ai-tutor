from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate

# Client parameters for the ChatOpenAI model
client_params = {
    "base_url": "https://apim-aoai-eas-dev02.azure-api.net/cs1302-2023/gpt35-api-94951",
    "model": "GPT-3.5-Turbo",
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

chat_prompt = PromptTemplate.from_template(
    """
You are an AI tutor, an expert in the field of teaching Python to beginners. Your task is to answer user's questions about Python.
The user is using JupyterLab. The information of the current cell is {cell}. Your task is to answer the user's question about it.
{history}

User: {question}

AI Tutor:"""
)


def get_response(cell, question, history):
    response = chat(
        chat_prompt.format_prompt(cell=cell, question=question, history=history).to_messages()
    )
    if history is None:
        history = ""
    history = history + "\nUser: " + question + "\nAI Tutor: " + response.content
    
    
    return response.content, history
