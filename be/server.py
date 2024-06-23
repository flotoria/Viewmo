import asyncio
import base64
import io
import pathlib
import uuid
import dotenv
import os
from fastapi import Depends, FastAPI, File, Form, Query, UploadFile
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
import json

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
    emotions: Optional[List[List[Emotion]]] = None 

class AverageEmotionScore(BaseModel):
    name: str
    average_score: float

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
    db_vid = Vid(video_id=vid_data['video_id'], emotions=vid_data['emotions'])
    db.add(db_vid)
    db.commit()
    db.refresh(db_vid)
    return db_vid

@app.get("/api/getVids", response_model=List[VidCreate])
def get_all_vids(db: Session = Depends(get_db)): 
    return db.query(Vid).all()

@app.get("/api/average-emotion-scores/", response_model=List[AverageEmotionScore])
def get_average_emotion_scores(video_id: str = Query(...), db: Session = Depends(get_db)):
    vids = db.query(Vid).filter(Vid.video_id == video_id).all()
    emotion_totals: Dict[str, List[float]] = {}
    
    for vid in vids:
        if vid.emotions:
            for emotion_list in vid.emotions:
                for emotion in emotion_list:
                    if (type(emotion) != str):
                        name = emotion['name']
                        score = emotion['score']
                        if name not in emotion_totals:
                            emotion_totals[name] = []
                        emotion_totals[name].append(score)

    average_emotion_scores = [
        AverageEmotionScore(name=name, average_score=sum(scores) / len(scores))
        for name, scores in emotion_totals.items()
    ]

    return average_emotion_scores

if __name__ == "__main__":
  uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)