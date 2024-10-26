import logging

from fastapi import APIRouter, Depends, Response, status, Form, UploadFile
from fastapi.responses import StreamingResponse
# from dependencies.database import get_db_session

from pydantic import BaseModel
import json
import base64
import requests

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/prompting", tags=["Prompting"], include_in_schema=False)

INFERENCE_LINK = "https://inference.ccrolabs.com/api/generate"

class Symptom(BaseModel):
    symptoms: str

@router.get("/questions")
def get_questions(symptom: Symptom, response: Response):
    symptoms = symptom.symptoms

    logger.info("Symptoms: " + symptoms)

    PROMPT = """
    You are a helpful assistant specialized in medical questions. You are given a list of symptoms and should only respond in a valid json.
    You should give questions to ask the user for better context.
    Given symptoms: """ + symptoms + """
    Json structure:
    {
        "questions_to_ask": [
        {
            "question": "str",
            "answers": ["str"]
        }
        ]
    }
    Always give 3 answers!
    Only respond with given structure, do not add any fields!
    """
    headers = {
        "Content-Type": "application/json"
    }
    data = {
        "model": "llama3.1:70b",
        "format": "json",
        "prompt": PROMPT,
        "stream": False,
        "temperature": "0.15"
    }

    logger.info("Sending request")

    res = requests.post(INFERENCE_LINK, headers=headers, data=json.dumps(data))

    decoder = json.JSONDecoder()
    return decoder.decode(res.json()["response"])