from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import Optional

class LoginInput(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    model_config = ConfigDict(from_attributes=True)

class PatientCreate(BaseModel):
    patient_id: str = Field(min_length=2, max_length=80)
    name: str = Field(min_length=1, max_length=120)
    date_of_birth: Optional[str] = None
    age: Optional[str] = None
    gender: Optional[str] = None
    gestational_age: Optional[str] = None
    birth_weight: Optional[float] = None
    birth_status: Optional[str] = None
    birth_type: Optional[str] = None
    hospital_unit: Optional[str] = None
    admission_date: Optional[str] = None
    clinical_information: Optional[str] = None

class NoteCreate(BaseModel):
    patient_id: int
    recording_id: Optional[int] = None
    note_type: str = "clinical"
    note: str = Field(min_length=1)
    visibility: str = "internal"

class PrescriptionCreate(BaseModel):
    patient_id: int
    medicine: str
    dosage: str
    frequency: str
    duration: str
    instructions: Optional[str] = None
    confirmed: bool = False
