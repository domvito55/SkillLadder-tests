# -*- coding: utf-8 -*-
"""
File Name: Main_v2.py
Description: simple chatbot using ChatBedrock
Author: mathteixeira55
Date: May 30, 2024
Version: 1.0.0
License:
Copyright:
Contact Information:
"""

### Importing the required libraries ###
# BedrockLLM returns a string only, use ChatBedrock to get metadata and text
from langchain_aws import BedrockLLM
from langchain.memory import ConversationBufferMemory
from langchain.prompts import PromptTemplate
import os
import boto3
import streamlit as st
###### end of imports

### environment variables ###
aws_access_key_id = os.getenv('AWS_ACCESS_KEY_ID')
aws_secret_access_key = os.getenv('AWS_SECRET_ACCESS_KEY')
aws_region = os.getenv('AWS_REGION', 'us-east-1')
###### end of environment variables

### Global variables ###
modelID = 'anthropic.claude-v2'

#Bedrock client
bedrock_client = boto3.client(
    service_name='bedrock-runtime',
    region_name=aws_region,
    aws_access_key_id=aws_access_key_id,
    aws_secret_access_key=aws_secret_access_key,
)
#LLM model
llm = BedrockLLM(
    model_id=modelID,
    client=bedrock_client,
    model_kwargs={
        'max_tokens_to_sample': 100,
        'temperature': 0.5
    }
)
###### end of global variables

# Function to create a chatbot
def my_chatbot(language, text):
    """Creates a simple chatbot using BedrockLLM

    Args:
        language (string): language of the chatbot
        text (string): question to the chatbot

    Returns:
        string: the chatbot text response
    """

    # Prompt template
    prompt = PromptTemplate(
        input_variables=["language", "text"],
        template="You are a chatbot. You are in {language}.\n\n{text}"
    )

    #LLMChain: passes the prompt and the LLM model
    bedrock_chain = prompt | llm

    # Execute the chain using the invoke method
    response = bedrock_chain.invoke({
        'language': language,
        'text': text
    })

    # Return the response
    return response



### Test ###
if __name__ == "__main__":
    # Single test
    # print(my_chatbot("English", "Who is Buddah?"))

    # Streamlit app (Frontend)
    st.title("Simple Chatbot")
    language = st.sidebar.selectbox("Language", ["English", "Portuguese"])

    if language:
        text = st.sidebar.text_area("Ask me anything", max_chars=100)

    if text:
        response = my_chatbot(language, text)
        st.write(response)
