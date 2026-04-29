import sys
sys.path.append('/Users/mattia/clawd-test')
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from routers import chapters, versions, versions_fs, ai

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chapters.router, prefix="/chapters", tags=["chapters"])
app.include_router(versions.router, prefix="/versions", tags=["versions"])
app.include_router(versions_fs.router, prefix="/versions_fs", tags=["versions_fs"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])

@app.post("/api/ai/revise")
async def revise_text(payload: dict):
    """
    Mock AI revision with cascade: NVIDIA -> Local Qwen.
    For demonstration, just returns the input text with a prefix.
    """
    text = payload.get("text", "")
    # Simulate cascade: first try NVIDIA (mock), then fallback to Local Qwen (mock)
    revised = f"[Revised via NVIDIA->Local Qwen cascade]: {text}"
    return {"original": text, "revised": revised}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)