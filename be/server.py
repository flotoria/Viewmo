import asyncio
import base64
import io
import pathlib
import uuid
import dotenv
import os
from fastapi import Depends, FastAPI, File, Form, UploadFile
from fastapi.responses import JSONResponse
from hume import HumeStreamClient, StreamSocket
from hume.models.config import FaceConfig
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tempfile
from sqlalchemy import Column, Integer, String, JSON, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from models import Base, Vid, SessionLocal, engine
from sqlalchemy.orm import Session
from typing import List, Optional, Dict

Base.metadata.create_all(bind=engine)

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

class Emotion(BaseModel):
    name: str
    score: float

class VidCreate(BaseModel):
    video_id: str
    emotions: Optional[List[Emotion]] = None
    def dict(self, *args, **kwargs):
        # Override to convert emotions to list of dictionaries
        vid_dict = super().dict(*args, **kwargs)
        if self.emotions is not None:
            vid_dict['emotions'] = [emotion.dict() for emotion in self.emotions]
        return vid_dict

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

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/api/addVid", response_model=VidCreate)
def create_vid(vid: VidCreate, db: Session = Depends(get_db)):
    vid_data = vid.dict()
    db_vid = Vid(video_id=vid.video_id, emotions=vid_data['emotions'])
    db.add(db_vid)
    db.commit()
    db.refresh(db_vid)
    return db_vid

if __name__ == "__main__":
  uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)