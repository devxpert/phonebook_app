from fastapi import FastAPI
from  .routers.contact import contact
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

origins = [
    "*",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(contact)
