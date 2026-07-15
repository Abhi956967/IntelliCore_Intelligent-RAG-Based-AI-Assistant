import os
import sys
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.agents.chatbot_agent import get_agent
from langchain_core.messages import SystemMessage, HumanMessage
from app.database.operations import init_db

init_db()

agent = get_agent("gemini-2.5-flash")


config = {
        "configurable": {
            "thread_id": "test_thread_id",
        }
    }


for message_chunk, metadata in agent.stream(
    {'messages': [HumanMessage(content="What is My name?")]},
    config= config,
    stream_mode= 'messages'):

    if message_chunk.content:
        print(message_chunk.content, end=" ", flush=True)
    