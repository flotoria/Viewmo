from sqlalchemy import Column, Integer, String, JSON, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import dotenv

dotenv.load_dotenv()
HOST = os.getenv("HOST")
PORT = os.getenv("PORT")
USER = os.getenv("USER")
PASSWORD = os.getenv("PASSWORD")
DATABASE = os.getenv("DATABASE")

DATABASE_URL = f"mysql+pymysql://{USER}:{PASSWORD}@{HOST}/{DATABASE}"

Base = declarative_base()

class Vid(Base):
    __tablename__ = "vids"

    id = Column(Integer, primary_key=True, index=True)
    video_id = Column(String(20), nullable=False)
    emotions = Column(JSON, nullable=True)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)
