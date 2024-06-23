import asyncio
import base64
import io
import pathlib
import uuid
import dotenv
import os
from fastapi import FastAPI, File, Form, UploadFile
from fastapi.responses import JSONResponse
from hume import HumeStreamClient, StreamSocket
from hume.models.config import FaceConfig
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tempfile

dotenv.load_dotenv()
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:8000",
]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
API_KEY = os.getenv("API_KEY")

@app.post('/api/uploadPhoto')
async def analyzeImage(file: UploadFile = File(...)):
  image_data = await file.read()
  print(image_data)
  with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as temp_file:
      temp_file.write(image_data)
      temp_file_path = temp_file.name
    
  client = HumeStreamClient(API_KEY)
  config = FaceConfig(identify_faces=True)
  async with client.connect([config]) as socket:
    result = await socket.send_file(temp_file_path)
  return JSONResponse(content=result, status_code=200)


if __name__ == "__main__":
  uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
