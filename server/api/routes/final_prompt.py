import logging

from fastapi import APIRouter, Depends, Response, status, Form, UploadFile
from fastapi.responses import StreamingResponse
from fastapi.security import OAuth2PasswordBearer

# from dependencies.database import get_db_session

from pydantic import BaseModel
import json
import base64
import requests

from model.symptoms import Symptom
from model.users import User
from model.medicamentation import Medicamentation
from model.google_fit import GoogleFit
from model.questions import Question
from model.answers import Answer
from model.context import Context
from model.health_report import HealthReport
from data.database import get_db_session
from fastapi.exceptions import HTTPException

from api.services.user_service import get_or_create_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/finalprompting", tags=["Prompting"], include_in_schema=False)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

INFERENCE_LINK = "https://inference.ccrolabs.com/api/generate"

class BodyAnswers(BaseModel):
    answers: str

@router.post("/")
def get_referrals(bodyanswers: BodyAnswers, token = Depends(oauth2_scheme), db_session = Depends(get_db_session)):
    get_or_create_user(token, db_session)

    user = db_session.query(User).filter(User.id == token).first()

    answers = bodyanswers.answers

    answers += ' '.join([answer.answer_text for answer in db_session.query(Answer).filter(Answer.user_id == token).all()])
    contexts = ' '.join([context.text for context in db_session.query(Context).filter(Context.user_id == token).all()])
    google_fit_names = ' '.join([google_report.parameter_name for google_report in db_session.query(GoogleFit).filter(GoogleFit.user_id == token).all()])
    google_fit_values = ' '.join([google_report.parameter_value for google_report in db_session.query(GoogleFit).filter(GoogleFit.user_id == token).all()])
    health_reports = ' '.join([health_report.report_text for health_report in db_session.query(HealthReport).filter(HealthReport.user_id == token).all()])
    medicamentations = ' '.join([medicamentation.name for medicamentation in db_session.query(Medicamentation).filter(Medicamentation.user_id == token).all()])
    questions = ' '.join([question.question_text for question in db_session.query(Question).filter(Question.user_id == token).all()])
    symptoms = ' '.join([symptom.text for symptom in db_session.query(Symptom).filter(Symptom.user_id == token).all()])


    PROMPT = """
    You are a helpful assistant specialized in the medical field.
Predict the three most probable medical specialties where a patient should seek consultation.
Patient Information:
Symptoms:""" + symptoms + """
Questions: """ + questions + """
Answers: """ + answers + """
Medication:""" + medicamentations + """
Recent Context: """ + contexts + """
Google Fitness Parameter Names: """ + google_fit_names + """
Google Fitness Parameter Values: """ + google_fit_values + """
Medical History: """ + health_reports + """
Response Format:
Provide a JSON array with three objects, each representing a medical specialty recommendation. Each object should include:
name: (string) The name of the medical specialty.
probability: (float) The likelihood (between 0 and 1) that this specialty is relevant.
short_reason: (string) A brief explanation for why this specialty is recommended.
short_suggestion: (string) A concise recommendation for the patient.
Example:
Patient Information:
Symptoms: persistent fatigue, occasional dizziness, intermittent joint pain
Medication: metformin for diabetes management
Recent Context: recently returned from a high-altitude trip, experiencing increased stress due to work changes
Google Fitness Data: irregular sleep patterns with an average of 5 hours per night, resting heart rate of 72 bpm, blood pressure fluctuating between 120/80 and 140/90 mmHg, regular daily activity with moderate exercise, normal oxygen saturation levels, balanced nutrition, and average body temperature
Medical History: previous diagnosis of mild anemia, recent MRI showing slight brain white matter changes
The response should have the following json format, and only respond like it. All responses should be in valid json format.
{
    "specialties": [
    {
        "name": "str",
        "probability": "float"
        "short_reason": "str"
        "short_suggestion": "str"
    },
    ]
}
Remember to respond always with 3 possibilities sorted by probability!
If the patient could have the problem from a bad lifestyle or recent lifestyle changes found in the google fit data or the answers to the questions, please include that option.
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
    refferals = res.json()["response"]


    return decoder.decode(refferals)