from fastapi import FastAPI
from api.v1.api import api_router
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

import os

load_dotenv()

app = FastAPI(title="GenAI Stack API")

origins = [
    "http://localhost:5173",
    "https://melodious-blancmange-675269.netlify.app" 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # or ["*"] during dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to the GenAI Stack API!"}
