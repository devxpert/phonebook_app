from sqlalchemy import Table,Column,Integer, String
from app.config.db import meta


contacts = Table(
    "contacts",
    meta,
    Column("id", Integer, primary_key=True),
    Column('firstname', String),
    Column('lastname', String),
    Column('phone', String)
)

