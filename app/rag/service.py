from pathlib import Path
from typing import List
import csv
import re
from dotenv import load_dotenv
import os
import certifi

load_dotenv()

os.environ["SSL_CERT_FILE"] = certifi.where()
os.environ["REQUESTS_CA_BUNDLE"] = certifi.where()

from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

from pypdf import PdfReader
import docx2txt


from app.storage import get_chroma_dir, get_uploads_dir

UPLOADS_DIR = get_uploads_dir()
CHROMA_DIR = get_chroma_dir()


# Embeddings model
embeddings = GoogleGenerativeAIEmbeddings(model="gemini-embedding-001")

vectorstore = Chroma(
    collection_name="agentic_chatbot_docs",
    embedding_function=embeddings,
    persist_directory=str(CHROMA_DIR)
)



def clean_text(text: str) -> str:
    text = text.replace("\x00", " ")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def read_file_text(file_path: str) -> str:
    path = Path(file_path)
    suffix = path.suffix.lower()

    if suffix == ".pdf":
        return "\n\n".join(page["text"] for page in read_file_sections(file_path))

    if suffix == ".docx":
        return clean_text(docx2txt.process(file_path))

    if suffix in [".txt", ".md", ".py"]:
        return clean_text(path.read_text(encoding="utf-8", errors="ignore"))

    if suffix == ".csv":
        return "\n".join(section["text"] for section in read_file_sections(file_path))

    raise ValueError("Unsupported file type. Upload PDF, DOCX, TXT, MD, PY, or CSV.")


def read_file_sections(file_path: str) -> list[dict]:
    path = Path(file_path)
    suffix = path.suffix.lower()

    if suffix == ".pdf":
        reader = PdfReader(file_path)
        sections = []

        for page_number, page in enumerate(reader.pages, start=1):
            text = clean_text(page.extract_text() or "")

            if text:
                sections.append({
                    "text": text,
                    "page": page_number,
                    "section": f"page {page_number}"
                })

        return sections

    if suffix == ".csv":
        rows = []

        with path.open("r", encoding="utf-8", errors="ignore", newline="") as file:
            reader = csv.reader(file)

            for row_number, row in enumerate(reader, start=1):
                if any(cell.strip() for cell in row):
                    rows.append({
                        "text": " | ".join(cell.strip() for cell in row),
                        "page": None,
                        "section": f"row {row_number}"
                    })

        return rows

    text = read_file_text(file_path)

    return [{
        "text": text,
        "page": None,
        "section": "document"
    }] if text else []




def add_document_to_rag(file_path: str, thread_id: str):
    sections = read_file_sections(file_path)

    if not sections:
        raise ValueError("No text could be extracted from this file.")

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=900,
        chunk_overlap=150
    )

    docs: List[Document] = []

    for section in sections:
        chunks = splitter.split_text(section["text"])

        for chunk_index, chunk in enumerate(chunks, start=1):
            docs.append(
                Document(
                    page_content=chunk,
                    metadata={
                        "thread_id": thread_id,
                        "source": Path(file_path).name,
                        "page": section.get("page"),
                        "section": section.get("section"),
                        "chunk": chunk_index
                    }
                )
            )

    if not docs:
        raise ValueError("No text chunks could be created from this file.")

    vectorstore.add_documents(docs)

    return {
        "filename": Path(file_path).name,
        "chunks": len(docs)
    }





def retrieve_from_rag(query: str, thread_id: str, k: int = 4) -> str:
    docs = vectorstore.similarity_search(
        query,
        k=k,
        filter={"thread_id": thread_id}
    )

    if not docs:
        return "No relevant uploaded document content found."

    from app.storage import current_sources
    sources = list(current_sources.get())

    results = []

    for i, doc in enumerate(docs, start=1):
        source = doc.metadata.get("source", "uploaded document")
        page = doc.metadata.get("page")
        section = doc.metadata.get("section")
        location = f", page {page}" if page else f", {section}" if section else ""
        results.append(
            f"[Document Source {i}: {source}{location}]\n{doc.page_content}"
        )
        
        # Avoid duplicate sources in the same request
        src_exists = any(s.get("name") == source and s.get("snippet") == doc.page_content for s in sources)
        if not src_exists:
            sources.append({
                "name": source,
                "type": "resume" if "resume" in source.lower() else "document",
                "snippet": doc.page_content,
                "page": page,
                "section": section
            })

    current_sources.set(sources)
    return "\n\n".join(results)


def delete_document_from_rag(filename: str, thread_id: str):
    """Delete all chunks for a specific document and thread from ChromaDB"""
    try:
        vectorstore.delete(where={"$and": [{"thread_id": {"$eq": thread_id}}, {"source": {"$eq": filename}}]})
    except Exception as e:
        # Fallback if the collection format doesn't support $and directly in this version
        try:
            vectorstore.delete(where={"thread_id": thread_id, "source": filename})
        except Exception:
            raise e
