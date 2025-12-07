from fastapi import FastAPI, UploadFile, File

app = FastAPI()

slides_db = {}

@app.get("/")
def root():
    return {"message": "Backend running!"}

@app.post("/upload_slides")
async def upload_slides(file: UploadFile = File(...)):
    slides_db["slides"] = file.filename
    return {"status": "received", "filename": file.filename}

@app.post("/ask")
async def ask_question(question: str):
    return {"answer": f"You asked: {question}. (Dummy Response)"}