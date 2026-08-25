import logging
import os
from pathlib import Path
import contextvars

current_sources = contextvars.ContextVar("current_sources", default=[])


def resolve_storage_dir() -> Path:
    configured = os.getenv("APP_STORAGE_DIR", "").strip()

    if configured:
        storage_dir = Path(configured)
        if not storage_dir.is_absolute():
            storage_dir = Path.cwd() / storage_dir
    else:
        # Default to the backend root directory
        storage_dir = Path(__file__).resolve().parent.parent

    try:
        storage_dir.mkdir(parents=True, exist_ok=True)
        return storage_dir
    except Exception as exc:
        fallback = Path.cwd() / "storage"
        try:
            fallback.mkdir(parents=True, exist_ok=True)
        except Exception:
            raise

        logging.warning(
            "Unable to create configured APP_STORAGE_DIR=%s (%s). "
            "Falling back to %s."
            % (configured, exc, fallback)
        )
        return fallback


def get_data_dir() -> Path:
    storage_dir = resolve_storage_dir()
    data_dir = storage_dir / "data"
    data_dir.mkdir(parents=True, exist_ok=True)
    return data_dir


def get_uploads_dir() -> Path:
    storage_dir = resolve_storage_dir()
    uploads_dir = storage_dir / "uploads"
    uploads_dir.mkdir(parents=True, exist_ok=True)
    return uploads_dir


def get_chroma_dir() -> Path:
    storage_dir = resolve_storage_dir()
    chroma_dir = storage_dir / "chroma_db"
    chroma_dir.mkdir(parents=True, exist_ok=True)
    return chroma_dir
