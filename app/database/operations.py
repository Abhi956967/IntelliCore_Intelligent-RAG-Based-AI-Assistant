from datetime import datetime
from pathlib import Path

from sqlalchemy import Boolean, create_engine, Column, Integer, String, Text, DateTime, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker

from app.storage import get_data_dir

DATA_DIR = get_data_dir()
DATABASE_URL = f"sqlite:///{DATA_DIR / 'chatbot_memory.db'}"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    thread_id = Column(String, unique=True, index=True)
    title = Column(String, default="New Chat")
    pinned = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    thread_id = Column(String, index=True)
    role = Column(String)
    content = Column(Text)
    sources_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class LongTermMemory(Base):
    __tablename__ = "long_term_memory"

    id = Column(Integer, primary_key=True, index=True)
    thread_id = Column(String, index=True)
    memory = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


class UploadedFile(Base):
    __tablename__ = "uploaded_files"

    id = Column(Integer, primary_key=True, index=True)
    file_id = Column(String, unique=True, index=True)
    thread_id = Column(String, index=True)
    filename = Column(String)
    file_path = Column(String)
    chunks_count = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)


def init_db():
    Base.metadata.create_all(bind=engine)
    _run_lightweight_migrations()


def _run_lightweight_migrations():
    inspector = inspect(engine)
    columns = {column["name"] for column in inspector.get_columns("conversations")}
    columns_msg = {column["name"] for column in inspector.get_columns("chat_messages")}

    with engine.begin() as conn:
        if "pinned" not in columns:
            conn.execute(text("ALTER TABLE conversations ADD COLUMN pinned BOOLEAN DEFAULT 0"))
        if "sources_json" not in columns_msg:
            conn.execute(text("ALTER TABLE chat_messages ADD COLUMN sources_json TEXT DEFAULT NULL"))


def create_or_update_conversation(thread_id: str, first_message: str | None = None):
    db = SessionLocal()

    try:
        conversation = (
            db.query(Conversation)
            .filter(Conversation.thread_id == thread_id)
            .first()
        )

        if not conversation:
            title = "New Chat"

            if first_message:
                title = first_message.strip()[:40]
                if len(first_message.strip()) > 40:
                    title += "..."

            conversation = Conversation(
                thread_id=thread_id,
                title=title,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )

            db.add(conversation)

        else:
            conversation.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(conversation)

        return conversation

    finally:
        db.close()


def list_conversations():
    db = SessionLocal()

    try:
        return (
            db.query(Conversation)
            .order_by(Conversation.pinned.desc(), Conversation.updated_at.desc())
            .all()
        )

    finally:
        db.close()


def get_conversation(thread_id: str):
    db = SessionLocal()

    try:
        return (
            db.query(Conversation)
            .filter(Conversation.thread_id == thread_id)
            .first()
        )

    finally:
        db.close()


def search_conversations(query: str):
    db = SessionLocal()

    try:
        clean_query = query.strip()

        if not clean_query:
            return list_conversations()

        like_query = f"%{clean_query}%"

        return (
            db.query(Conversation)
            .outerjoin(ChatMessage, ChatMessage.thread_id == Conversation.thread_id)
            .filter(
                (Conversation.title.ilike(like_query)) |
                (ChatMessage.content.ilike(like_query))
            )
            .group_by(Conversation.id)
            .order_by(Conversation.pinned.desc(), Conversation.updated_at.desc())
            .all()
        )

    finally:
        db.close()


def update_conversation(thread_id: str, title: str | None = None, pinned: bool | None = None):
    db = SessionLocal()

    try:
        conversation = (
            db.query(Conversation)
            .filter(Conversation.thread_id == thread_id)
            .first()
        )

        if not conversation:
            return None

        if title is not None:
            clean_title = title.strip()
            if clean_title:
                conversation.title = clean_title[:120]

        if pinned is not None:
            conversation.pinned = pinned

        conversation.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(conversation)

        return conversation

    finally:
        db.close()


def delete_conversation(thread_id: str):
    db = SessionLocal()

    try:
        conversation = (
            db.query(Conversation)
            .filter(Conversation.thread_id == thread_id)
            .first()
        )

        if not conversation:
            return False

        db.query(ChatMessage).filter(ChatMessage.thread_id == thread_id).delete()
        db.query(LongTermMemory).filter(LongTermMemory.thread_id == thread_id).delete()
        db.query(UploadedFile).filter(UploadedFile.thread_id == thread_id).delete()
        db.delete(conversation)
        db.commit()

        return True

    finally:
        db.close()


def delete_all_conversations():
    db = SessionLocal()

    try:
        db.query(ChatMessage).delete()
        db.query(LongTermMemory).delete()
        db.query(UploadedFile).delete()
        db.query(Conversation).delete()
        db.commit()

    finally:
        db.close()


def save_chat_message(thread_id: str, role: str, content: str, sources_json: str | None = None):
    db = SessionLocal()

    try:
        msg = ChatMessage(
            thread_id=thread_id,
            role=role,
            content=content,
            sources_json=sources_json,
            created_at=datetime.utcnow()
        )

        db.add(msg)

        conversation = (
            db.query(Conversation)
            .filter(Conversation.thread_id == thread_id)
            .first()
        )

        if conversation:
            conversation.updated_at = datetime.utcnow()

        db.commit()

    finally:
        db.close()


def get_chat_history(thread_id: str):
    db = SessionLocal()

    try:
        return (
            db.query(ChatMessage)
            .filter(ChatMessage.thread_id == thread_id)
            .order_by(ChatMessage.created_at.asc())
            .all()
        )

    finally:
        db.close()


def save_memory(thread_id: str, memory: str):
    db = SessionLocal()

    try:
        item = LongTermMemory(
            thread_id=thread_id,
            memory=memory,
            created_at=datetime.utcnow()
        )

        db.add(item)
        db.commit()

        return "Memory saved successfully."

    finally:
        db.close()


def search_memory(thread_id: str, query: str):
    db = SessionLocal()

    try:
        # Search all memories across all threads to allow cross-session memory!
        memories = (
            db.query(LongTermMemory)
            .order_by(LongTermMemory.created_at.desc())
            .limit(30)
            .all()
        )

        if not memories:
            return "No saved memory found."

        return "\n".join([f"- {m.memory}" for m in memories])

    finally:
        db.close()


def save_uploaded_file(thread_id: str, file_id: str, filename: str, file_path: str, chunks_count: int):
    db = SessionLocal()
    try:
        item = UploadedFile(
            thread_id=thread_id,
            file_id=file_id,
            filename=filename,
            file_path=file_path,
            chunks_count=chunks_count,
            created_at=datetime.utcnow()
        )
        db.add(item)
        db.commit()
        db.refresh(item)
        return item
    finally:
        db.close()


def list_uploaded_files(thread_id: str):
    db = SessionLocal()
    try:
        return (
            db.query(UploadedFile)
            .filter(UploadedFile.thread_id == thread_id)
            .order_by(UploadedFile.created_at.desc())
            .all()
        )
    finally:
        db.close()


def delete_uploaded_file(thread_id: str, file_id: str):
    db = SessionLocal()
    try:
        item = (
            db.query(UploadedFile)
            .filter(UploadedFile.thread_id == thread_id, UploadedFile.file_id == file_id)
            .first()
        )
        if not item:
            return None
        db.delete(item)
        db.commit()
        return item
    finally:
        db.close()
