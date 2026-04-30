# HEARTBEAT — Clawdinho-M1 (2026-04-27 20:42 PDT) — FEAT-WRITE-CHAPTER-02

## CONTESTO (2 righe)
- Working dir: `/Volumes/DATI-SSD/Free-River-House/Books-Wizard/`
- FEAT-AI-MAGIC-01 SHIPPED (PR #1). Adesso fai **FEAT-WRITE-CHAPTER-02**.

## TASK — FAI ESATTAMENTE QUESTI STEP IN ORDINE, UNO ALLA VOLTA

### STEP 1 — preflight (1 comando bash)
```bash
cd /Volumes/DATI-SSD/Free-River-House/Books-Wizard && git fetch origin && git checkout main && git pull origin main && git checkout -b feat-write-chapter-02 2>/dev/null || git checkout feat-write-chapter-02
```
Dopo questo step → manda subito update TG: `[clawdinho HH:MM] step1 ok branch ready`

### STEP 2 — leggi ai.py per capire dove inserire
```bash
sed -n '1,40p' /Volumes/DATI-SSD/Free-River-House/Books-Wizard/backend/routers/ai.py
grep -n "^@router\|^class.*Request\|REVISION_MODES" /Volumes/DATI-SSD/Free-River-House/Books-Wizard/backend/routers/ai.py
```
TG update: `[clawdinho HH:MM] step2 ai.py letto, layout chiaro`

### STEP 3 — aggiungi endpoint write-chapter (UN SOLO Edit tool call)
Inserisci DOPO l'endpoint `/api/ai/revise` (cerca con grep la fine di quella funzione) il blocco:

```python
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
```

Se `call_ai_cascade` o `NoProvidersError` non esistono nel file, copia lo stesso pattern usato da `/api/ai/revise` (cerca con grep). NON inventare imports nuovi.

TG update: `[clawdinho HH:MM] step3 endpoint scritto`

### STEP 4 — frontend bottone (UN SOLO Edit tool call)
File: `frontend/src/app/book/[slug]/page.tsx`

Aggiungi sopra la lista dei capitoli un bottone `🪄 Generate Chapter` che apre un modal con form (topic textarea, style select narrative/technical/poetic, target_length number 200-3000, language autodedotto da metadata).

Al submit: `POST /api/ai/write-chapter` → preview chapter_title + chapter_content. Bottoni "Save as new chapter" (PUT `/api/books/<slug>/chapters/<NN-slug>.txt` + update metadata.json chapters array) o "Discard" (chiudi modal).

Se 503 dalla API: toast `Configure NVIDIA_API_KEY or LOCAL_MODEL_URL in backend/.env` + disable bottone (riusa pattern esistente di FEAT-AI-MAGIC-01).

TG update: `[clawdinho HH:MM] step4 UI fatta`

### STEP 5 — commit + push + PR
```bash
cd /Volumes/DATI-SSD/Free-River-House/Books-Wizard
git add backend/routers/ai.py frontend/src/app/book/
git commit -m "feat(write-chapter): /api/ai/write-chapter endpoint + UI Generate Chapter modal"
git push origin feat-write-chapter-02
gh pr create --base main --head feat-write-chapter-02 --title "feat(write-chapter): AI Generate Chapter from topic" --body "Backend POST /api/ai/write-chapter (cascade AI). Frontend Generate Chapter modal (topic/style/length/language). Save as new chapter or Discard. 503 graceful."
```

### STEP 6 — append a `/Users/mattia/bin/frh-clawdinho-report.md`
```
FEAT-WRITE-CHAPTER-02 DONE
SHA: <git rev-parse HEAD>
PR: <url>
Branch: feat-write-chapter-02
```
TG update: `[clawdinho HH:MM] step6 PR aperta <url>`

## REGOLE FERREE — RILEGGI OGNI VOLTA
1. **NON pensare troppo, ESEGUI.** Niente lunghi blocchi di "thinking". Per ogni step: pensa max 2 righe, poi tool call.
2. **Manda TG update dopo OGNI step** (chat Clawdinho-M1 bot, plugin telegram reply). Format: `[clawdinho HH:MM] stepN <stato>`
3. Se sei stuck/incerto > 5 min → manda TG con la **domanda specifica**. NON loopare nel thinking.
4. **NON testare API live** (`/api/ai/revise` o `/api/ai/write-chapter`) — atteso 503 con .env vuoto.
5. NO `git add -A`, NO `git push --force`, NO main diretto, branch nuovo `feat-write-chapter-02`.
6. gh auth account = `magmaticxr`.
7. SSD 99% → NO `npm install`, NO file grossi.

— Nemo (20:42 PDT, sessione resettata + cascade switched a Kimi K2)
