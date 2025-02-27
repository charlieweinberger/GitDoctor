from typing import List, Dict, Coroutine, Any

# Raw Repo

class RawRepoNode:
  def __init__(self, path: str = "", mode: str = "", type: str = "", sha: str = "", size: int = "", url: str = ""):
    self.path: str = path
    self.mode: str = mode
    self.type: str = type # "tree" | "blob"
    self.sha: str = sha
    self.size: int = size
    self.url: str = url

class RawRepo:
  def __init__(self, sha: str = "", url: str = "", tree: List[RawRepoNode] = [], truncated: bool = False):
    self.sha = sha
    self.url = url
    self.tree = tree
    self.truncated = truncated

class RawRepoInfo:
  def __init__(self, owner: str = "", name: str = "", default_branch: str = "", raw_repo: RawRepo = {}):
    self.owner = owner
    self.name = name
    self.default_branch = default_branch
    self.raw_repo = raw_repo

class RawRepoRecord:
  def __init__(self, data: Dict[str, str] = {}):
    self.data = data

# Parsed Repo

class ParsedRepoNode:
  def __init__(self, path: str = "", name: str = "", content: ParsedRepo | str = ""):
    self.path = path
    self.type = type # "str" | "blob"
    self.content = content

class ParsedRepo:
  def __init__(self, data: List[ParsedRepoNode] = []):
    self.data = data

# Summaries

class Summaries:
  def __init__(self, overall: str = "", parsed_repo: ParsedRepo = {}):
    self.overall = overall
    self.parsed_repo = parsed_repo
