from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("No DATABASE_URL found in environment variables")

# Add SSL requirement only if we're connecting to Render
connect_args = {}
if "render.com" in DATABASE_URL:
    connect_args["sslmode"] = "require"

engine = create_engine(DATABASE_URL, connect_args=connect_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
