from fastapi import FastAPI, UploadFile, File, HTTPException
import faiss
from openai import OpenAI
import numpy as np
from pydantic import BaseModel
from dotenv import load_dotenv
import os
from pathlib import Path
from .extract import extract_pdf, extract_pptx, build_json

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")


#OpenAI setup
client = OpenAI()

embedding_dim = 1536
index = faiss.IndexFlatL2(embedding_dim)

stored_chunks = []


# Creating Endpoints
app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


slides_db = {}

@app.get("/")
def root():
    return {"message": "Backend running!"}

class SlideInput(BaseModel):
    text: str

def chunk_text(text, chunk_size=500):
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i:i+chunk_size])
        chunks.append(chunk)
    return chunks

@app.post("/upload_slides")
async def upload_slides(file: UploadFile = File(...), course_id: str = "", lecture_title: str = ""):
    global index, stored_chunks

    ext = Path(file.filename).suffix.lower()

    if ext not in {".pptx", ".pdf"}:
        raise HTTPException(status_code=400, detail = "Only support .pptx or .pdf")
    
    temp = Path("/tmp") / file.filename
    temp.write_bytes(await file.read())

    if ext == ".pptx":
        slides = extract_pptx(temp)
        source_type = "pptx"
    else:
        slides = extract_pdf(temp)
        source_type = "pdf"

    
    doc_json = build_json(
        course_id = course_id or "unknown",
        lecture_title = lecture_title or temp.stem,
        source_file = str(temp),
        source_type = source_type,
        slides = slides,
    )


    chunks = []

    for slide in slides:
        chunks.append(slide["title"])
        chunks.extend(slide["text_blocks"])
        if slide.get("notes"):
            chunks.append(slide["notes"])

    embeddings = []
    for chunk in chunks:
        stored_chunks.append(chunk)
        emb = client.embeddings.create(
            model="text-embedding-3-small",
            input=chunk
        ).data[0].embedding
        embeddings.append(emb)
    embeddings_np = np.array(embeddings).astype("float32")

    index.add(embeddings_np)
    return {"status": "Slides uploaded and processed!", "chunks": len(embeddings), "slides": len(slides)}


class QuestionInput(BaseModel):
    question: str


@app.post("/ask")
async def ask_question(input: QuestionInput):
    global index, stored_chunks

    if index is None or index.ntotal == 0:
        return {"answer": "No slides have been uploaded yet."}
    question = input.question
    q_emb = client.embeddings.create(
        model="text-embedding-3-small",
        input=question,
    ).data[0].embedding
    q_emb_np = np.array(q_emb).astype("float32").reshape(1, -1)

    k = 3
    distances, indices = index.search(q_emb_np, k)
    context_chunks = [stored_chunks[i] for i in indices[0] if i < len(stored_chunks)]
    context = "\n\n".join(context_chunks)
    messages = [
        {"role": "system", "content": "You are a helpful teaching assistant. Use the slides to answer clearly."},
        {"role": "user", "content": f"Slides:\n{context}\n\nQuestion: {question}"}
    ]
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages
    )

    answer = response.choices[0].message.content
    return {"answer": answer}
