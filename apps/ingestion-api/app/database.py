import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

pool = None

async def connect():
    global pool
    pool = await asyncpg.create_pool(
        dsn=os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/llm_obs"),
        min_size=2,
        max_size=10
    )
    print("[DB] Connected to Postgres")

async def disconnect():
    global pool
    if pool:
        await pool.close()
        print("[DB] Disconnected from Postgres")

# Call this whenever you need to run a query
def get_pool():
    return pool