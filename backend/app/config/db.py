from sqlalchemy import create_engine, MetaData

# engine = create_engine("psycopg2://postgresql:postgresql@database:5432/postgresql")
engine = create_engine("postgresql://postgresql:postgresql@database/postgresql")


meta = MetaData()

conn = engine.connect()