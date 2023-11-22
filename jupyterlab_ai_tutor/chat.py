from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate


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


def get_chat(client_type):
    if client_type == "APIM":
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

        chat = ChatOpenAI(**client_params)
        chat.client.create = modify_client_create("")(chat.client)

    elif client_type == "Next":
        client_params = {
            "model" : "gpt-4",
            "api_key": "ak-049yNmca1tVO1VAqGdhcxCoIYoSuCf8uPoZQmTC6L4zMHHog",
            "base_url": "https://api.nextweb.fun/openai/v1",
            "temperature": 0,
        }
        chat = ChatOpenAI(**client_params)

    return chat


chat = get_chat("Next")

# Initialize the chat model with modified client


chat_prompt = PromptTemplate.from_template(
    """
Hello, I'm your AI tutor, specialized in teaching Python to beginners. My mission is to assist you in understanding Python better.
Currently, you are working with JupyterLab. Let's take a look at the code in your current cell: {cell}. 

So far, our conversation has been: {history}

Now, you have a question: {question}

Let's dive into it. AI Tutor: """
)

def get_response(cell, question, history):
    response = chat(
        chat_prompt.format_prompt(cell=cell, question=question, history=history).to_messages()
    )
    if history is None:
        history = ""
    history = history + "\nUser: " + question + "\nAI Tutor: " + response.content

    return response.content, history


get_response("print('Hello World!')", "What is the output?", None)