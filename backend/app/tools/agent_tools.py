import math
import os
from dotenv import load_dotenv
from langchain_core.tools import tool
from app.database.operations import (
    save_memory,
    search_memory,
    list_conversations,
    get_chat_history
)
from app.portfolio.knowledge import search_portfolio_knowledge
from app.rag.service import retrieve_from_rag


load_dotenv()


CURRENT_THREAD_ID = "default"


def set_current_thread_id(thread_id: str):
    global CURRENT_THREAD_ID
    CURRENT_THREAD_ID = thread_id


@tool("tavily_search")
def web_search(query: str, topic: str = "general") -> str:
    """
    Search the web for real-time information, current weather, latest news, politics, sports, or recent events.
    Use topic='news' for news/current events, and topic='general' for general queries.
    Input should be a search query.
    """
    try:
        from tavily import TavilyClient
        api_key = os.getenv("TAVILY_API_KEY")
        if not api_key:
            return "Error: TAVILY_API_KEY environment variable is not set."
            
        client = TavilyClient(api_key=api_key)
        # Limit max_results to 3 to keep it token efficient
        response = client.search(
            query=query,
            topic=topic,
            max_results=3,
            search_depth="advanced"
        )
        
        results = response.get("results", [])
        if not results:
            return f"No web search results found for: {query}"
            
        from app.storage import current_sources
        sources = list(current_sources.get())
        
        formatted_results = []
        for res in results:
            title = res.get("title", "Untitled")
            url = res.get("url", "No URL")
            content = res.get("content", "")
            # Truncate content to avoid token overflow
            truncated_content = content[:800] if len(content) > 800 else content
            formatted_results.append(
                f"Title: {title}\nURL: {url}\nContent: {truncated_content}\n"
            )
            
            src_exists = any(s.get("name") == title and s.get("url") == url for s in sources)
            if not src_exists:
                sources.append({
                    "name": title,
                    "type": "web",
                    "url": url,
                    "snippet": truncated_content
                })
        
        current_sources.set(sources)
        return "\n---\n".join(formatted_results)
    except Exception as e:
        return f"Error performing web search: {str(e)}"


@tool
def calculator(expression: str) -> str:
    """
    Useful for simple math calculations.
    Input should be a valid math expression.
    Example: 2 + 2, math.sqrt(16), 10 * 5
    """

    try:
        allowed = {
            "math": math,
            "abs": abs,
            "round": round,
            "min": min,
            "max": max,
            "sum": sum
        }

        result = eval(expression, {"__builtins__": {}}, allowed)
        return str(result)

    except Exception as e:
        return f"Calculation error: {str(e)}"
    


@tool
def search_portfolio(query: str) -> str:
    """
    Search structured portfolio knowledge about Abhishek Maurya, including
    summary, experience, projects, skills, education, certifications, contact,
    and IntelliCore architecture.
    Use this for portfolio, resume/profile, project, skills, hiring-fit,
    GitHub, education, and contact questions about Abhishek.
    """
    from app.storage import current_sources
    sources = list(current_sources.get())
    result = search_portfolio_knowledge(query)
    
    # Avoid duplicate sources in same request
    if not any(s.get("name") == "Abhishek Maurya Portfolio" for s in sources):
        sources.append({
            "name": "Abhishek Maurya Portfolio",
            "type": "portfolio",
            "snippet": result[:800] if len(result) > 800 else result
        })
        current_sources.set(sources)
        
    return result


@tool
def search_uploaded_documents(query: str) -> str:
    """
    Search uploaded documents for relevant information.
    Use this when the user asks about uploaded PDFs, DOCX, TXT, notes, files, or documents.
    """

    return retrieve_from_rag(
        query=query,
        thread_id=CURRENT_THREAD_ID
    )




@tool
def remember_this(memory: str) -> str:
    """
    Save an important user preference or fact into long-term memory.
    Use this when the user asks you to remember something.
    """

    return save_memory(
        thread_id=CURRENT_THREAD_ID,
        memory=memory
    )



@tool
def recall_memory(query: str) -> str:
    """
    Recall saved long-term memories about the user or this conversation.
    """

    return search_memory(
        thread_id=CURRENT_THREAD_ID,
        query=query
    )





@tool
def list_past_conversations() -> str:
    """
    List recent conversation threads/chats, including their thread IDs and titles.
    Use this to find previous chats or check what was discussed in past sessions.
    """
    try:
        convs = list_conversations()
        if not convs:
            return "No past conversations found."
            
        # Format the list of conversations cleanly
        formatted = []
        for c in convs:
            is_current = " (Current Chat)" if c.thread_id == CURRENT_THREAD_ID else ""
            formatted.append(f"- Title: {c.title} | Thread ID: {c.thread_id}{is_current}")
            
        return "\n".join(formatted)
    except Exception as e:
        return f"Error listing past conversations: {str(e)}"


@tool
def get_past_conversation_history(thread_id: str) -> str:
    """
    Get the full chat history (role and message content) for a specific thread_id.
    Use this to retrieve information, names, context, or decisions from a past conversation.
    """
    try:
        messages = get_chat_history(thread_id)
        if not messages:
            return f"No chat history found for thread ID: {thread_id}"
            
        formatted = []
        for msg in messages:
            formatted.append(f"{msg.role.upper()}: {msg.content}")
            
        return "\n".join(formatted)
    except Exception as e:
        return f"Error retrieving chat history: {str(e)}"


tools = [
    calculator,
    search_portfolio,
    search_uploaded_documents,
    remember_this,
    recall_memory,
    list_past_conversations,
    get_past_conversation_history,
    web_search
]
