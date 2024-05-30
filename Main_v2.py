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
# ChatBedrock invoke returns a AIMessage object with metadata and text
# as oposed to BedrockLLM that returns a string
from langchain_aws import ChatBedrock
from langchain.memory import ConversationBufferMemory
from langchain.prompts import PromptTemplate
import os
import boto3
import streamlit as st
###### end of imports

### environment variables ###
os.environ['AWS_REGION'] = 'us-east-1'
os.environ['AWS_PROFILE'] = 'aws_ai_901236904'
###### end of environment variables

### Global variables ###
modelID = 'anthropic.claude-v2'

#Bedrock client
bedrock_client = boto3.client(
    service_name='bedrock-runtime',
    region_name=os.environ['AWS_REGION']
)

#LLM model
llm = ChatBedrock(
    model_id=modelID,
    client=bedrock_client,
    model_kwargs={
        'max_tokens': 100, # max tokens in the output
        'temperature': 0.5 # randomness of the output: 0 is more deterministic,
                           #                           1 is more criative
    }
)
###### end of global variables

# Function to create a chatbot
def my_chatbot(language, text):
    """Creates a simple chatbot using ChatBedrock

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

if __name__ == "__main__":
    print(my_chatbot("English", "Who is Buddah?"))



