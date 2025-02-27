import aiohttp
from api.types import *

async def fetch(url: str, headers: Dict[str, str] = {}) -> Any | None:
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=headers) as response:
                response.raise_for_status()  # Raise exception for HTTP errors
                data: Any = await response.json()
                return data
    except aiohttp.ClientError as e:
        print(f"Error fetching from {url}: {e}")
    except aiohttp.ClientResponseError as e:
        print(f"HTTP error in response from {url}: {e}")
    except Exception as e:
        print(f"Other error when fetching from {url}: {e}")