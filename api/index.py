from fastapi import FastAPI

### Create FastAPI instance with custom docs and openapi url
app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

# TODO convert /src/app/api/create-docs (nextjs) into /api (fastapi, here)

@app.get("/api/py/create-docs")
def create_docs():
    return {"message": "Hello from FastAPI"}