from pydantic import BaseModel

class Contact(BaseModel):
    firstname: str
    lastname: str
    phone: str