from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from gitingest import ingest
from api.types import *
# from get_repo import get_repo
# from summarize import summarize

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# @app.get("/api/py/create-docs/")
# async def create_docs(url: str = "") -> Summaries:
#     if url == "":
#         raise HTTPException(status_code=400, detail="Missing URL parameter")
#     parsed_repo: ParsedRepo = await get_repo(url)
#     summaries: Summaries = await summarize(parsed_repo)
#     return summaries

@app.get("/api/py/gitingest/")
def gitingest(url: str = ""):
    if url == "":
        raise HTTPException(status_code=400, detail="Missing URL parameter")
    summary, tree, content = ingest(url)
    print("\nSummary:")
    print(summary)
    print("\nTree:")
    print(tree)
    print("\nContent:")
    print(content)
    return {
        "summary": summary,
        "tree": tree,
        "content": content
    }
