import logging

from fastapi import APIRouter, Depends, Response, status, Form, UploadFile
from fastapi.responses import StreamingResponse
from fastapi import Header
from fastapi.security import OAuth2PasswordBearer
from model.medicamentation import Medicamentation
# from dependencies.database import get_db_session

from data.database import get_db_session
from pydantic import BaseModel

import base64

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/create-medication", tags=["Create-Medication"], include_in_schema=False)

INFERENCE_LINK = "https://inference.ccrolabs.com/api/generate"

class BodyMedication(BaseModel):
    medications: str

@router.post("/create-medication")
def create_medication(medication: BodyMedication, response: Response, db_session = Depends(get_db_session)):
    medications_string = medication.medications

    logger.info("Medications: " + medications_string)

    new_medicamentation = Medicamentation(1, medications_string, "1234")

    db_session.add(new_medicamentation)
    db_session.commit()