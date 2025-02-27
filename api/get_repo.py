from dotenv import load_dotenv
import os
from api.types import *

load_dotenv()
HEADERS = {
    "Authorization": f"Bearer {os.getenv('GITHUB_TOKEN')}",
}

async def fetch_repo_data(url: str):
    pass

async def restructure_raw_repo(raw_repo_info: RawRepoInfo):
    pass

def convert_to_parsed_repo(restructured_raw_repo: RawRepoRecord, base_path: str = "") -> ParsedRepo:
    pass

async def get_repo(url: str):
    raw_repo_info: RawRepoInfo = await fetch_repo_data(url)
    print("\n\n\nraw_repo_info: ")
    print(raw_repo_info)
    restructured_raw_repo: RawRepoRecord = await restructure_raw_repo(raw_repo_info)
    print("\n\n\nrestructured_raw_repo: ")
    print(restructured_raw_repo)
    return convert_to_parsed_repo(restructured_raw_repo)
