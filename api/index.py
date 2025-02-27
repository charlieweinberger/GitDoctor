from fastapi import FastAPI, HTTPException

from api.types import *
from get_repo import get_repo
from summarize import summarize

app = FastAPI()

@app.get("/api/py/create-docs")
async def create_docs(url: str = "") -> Summaries:
    if url == "":
        raise HTTPException(status_code=400, detail="Missing URL parameter")
    parsed_repo: ParsedRepo = await get_repo(url)
    summaries: Summaries = await summarize(parsed_repo)
    return summaries
