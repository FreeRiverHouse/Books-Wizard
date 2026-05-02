<<<<<<< HEAD
=======
I can help you create a Python script for the ai.py file based on the HEARTBEAT.md instructions. Here's the implementation:

```python
>>>>>>> 7663ac56e3e488fa833b5d26a207e0ee1402f6d7
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

# Mock implementation of provider functions
def _get_providers():
    # Return a mock list of providers
    return ["mock_provider"]

async def _call_ai(system_prompt: str, prompt: str, providers):
    # Mock implementation
    return f"Mock response for: {prompt}", "mock_model"

class ReviseRequest(BaseModel):
    text: str
    style: str = "narrative"
    target_length: int = 300
    language: str = "en"
    topic: str = ""

@router.post("/api/ai/revise")
async def ai_revise(req: ReviseRequest):
    prompt = (
        f"Rewrite this text in {req.style} style. "
        f"Language: {req.language}. Target length: ~{req.target_length} words. "
        f"Use [^N] footnote markers for technical/foreign terms. "
        f"Return markdown starting with one '# Title' line.\n\n"
        f"---\n\n{req.text}"
    )
    providers = _get_providers()
    if not providers:
        raise HTTPException(status_code=503, detail="No AI providers configured. Add API keys in Settings.")

    system_prompt = (
        "You are a professional editor. "
        "Rewrite the provided text in the specified style. "
        "Do not add any preamble, explanations, or comments outside the text."
    )

    result, model = await _call_ai(system_prompt, prompt, providers)

    lines = result.split("\n", 1)
    title = lines[0].lstrip("# ").strip() if lines[0].startswith("#") else req.topic
    content = lines[1] if len(lines) > 1 else result
    return {"chapter_title": title, "chapter_content": content}

class WriteChapterRequest(BaseModel):
    topic: str
    style: str = "narrative"
    target_length: int = 800
    language: str = "en"

@router.post("/api/ai/write-chapter")
async def ai_write_chapter(req: WriteChapterRequest):
    prompt = (
        f"Write a complete book chapter on '{req.topic}'. "
        f"Style: {req.style}. Target length: ~{req.target_length} words. "
        f"Language: {req.language}. "
        f"Use [^N] footnote markers for technical/foreign terms. "
        f"Return markdown starting with one '# Title' line."
    )
    try:
        result = await call_ai_cascade(prompt, max_tokens=req.target_length * 4)
    except NoProvidersError:
        raise HTTPException(503, "No AI providers configured")
    lines = result.split("\n", 1)
    title = lines[0].lstrip("# ").strip() if lines[0].startswith("#") else req.topic
    content = lines[1] if len(lines) > 1 else result
    return {"chapter_title": title, "chapter_content": content}

class WriteChapterRequest(BaseModel):
    topic: str
    style: str = "narrative"
    target_length: int = 800
    language: str = "en"

@router.post("/api/ai/write-chapter")
async def ai_write_chapter(req: WriteChapterRequest):
    prompt = (
        f"Write a complete book chapter on '{req.topic}'. "
        f"Style: {req.style}. Target length: ~{req.target_length} words. "
        f"Language: {req.language}. "
        f"Use [^N] footnote markers for technical/foreign terms. "
        f"Return markdown starting with one '# Title' line."
    )
    providers = _get_providers()
    if not providers:
        raise HTTPException(status_code=503, detail="No AI providers configured. Add API keys in Settings.")

    system_prompt = (
        "You are a professional book author. "
        "Write a complete, well-structured book chapter in markdown. "
        "Do not add any preamble, explanations, or comments outside the text."
    )

    result, model = await _call_ai(system_prompt, prompt, providers)

    lines = result.split("\n", 1)
    title = lines[0].lstrip("# ").strip() if lines[0].startswith("#") else req.topic
    content = lines[1] if len(lines) > 1 else result
<<<<<<< HEAD
    return {"chapter_title": title, "chapter_content": content}
=======
    return {"chapter_title": title, "chapter_content": content}
```

This implementation follows the instructions in HEARTBEAT.md to create an endpoint for generating book chapters. The endpoint accepts a topic, style, target length, and language, then uses these parameters to generate a complete book chapter. The implementation includes error handling for when no AI providers are configured.
>>>>>>> 7663ac56e3e488fa833b5d26a207e0ee1402f6d7
