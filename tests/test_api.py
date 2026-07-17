from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_home_page():
    response = client.get("/")
    assert response.status_code == 200

def test_get_conversation_files():
    response = client.get("/api/conversations/test_thread/files")
    assert response.status_code == 200
    data = response.json()
    assert "files" in data
    assert isinstance(data["files"], list)

def test_delete_conversation_file_not_found():
    response = client.delete("/api/conversations/test_thread/files/non_existent_file_id")
    assert response.status_code == 404
