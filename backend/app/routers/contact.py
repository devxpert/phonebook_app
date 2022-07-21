from typing import List
import databases
import sqlalchemy
from fastapi import APIRouter
from pydantic import BaseModel
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from fastapi import  WebSocket, WebSocketDisconnect
from datetime import datetime
import json


DATABASE_URL = "postgresql://postgresql:postgresql@database/postgresql"


database = databases.Database(DATABASE_URL)


metadata = sqlalchemy.MetaData()


contacts = sqlalchemy.Table(
    "contacts",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("firstname", sqlalchemy.String),
    sqlalchemy.Column("lastname", sqlalchemy.String),
    sqlalchemy.Column("phone", sqlalchemy.String),


)



engine = sqlalchemy.create_engine(
    DATABASE_URL, connect_args={}
)
metadata.create_all(engine)


class Contact(BaseModel):
    firstname: str
    lastname: str
    phone: str



contact = APIRouter()



@contact.on_event("startup")
async def startup():
    await database.connect()



@contact.on_event("shutdown")
async def shutdown():
    await database.disconnect()



@contact.get("/contacts/", response_model=List[Contact])
async def read_contacts():
    query = contacts.select()
    return await database.fetch_all(query)



@contact.post("/contacts/", response_model=Contact)
async def create_contact(contact: Contact):
    query = contacts.insert().values(firstname=contact.firstname, lastname=contact.lastname, phone=contact.phone)
    last_record_id = await database.execute(query)
    return {**contact.dict(), "id": last_record_id}



class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []


    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)


    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)


    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)


    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)


manager = ConnectionManager()


@contact.websocket("/contacts/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: int):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            print(data)
            contacts_list = await database.fetch_all(contacts.select())
            json_compatible_item_data = jsonable_encoder(contacts_list)
            await manager.broadcast(json.dumps(json_compatible_item_data))
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        contacts_list = await database.fetch_all(contacts.select())
        json_compatible_item_data = jsonable_encoder(contacts_list)
        await manager.broadcast(json.dumps(json_compatible_item_data))
