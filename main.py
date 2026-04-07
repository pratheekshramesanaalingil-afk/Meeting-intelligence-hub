import bs4
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from langchain_community.document_loaders import PyPDFLoader
from langchain_experimental.text_splitter import SemanticChunker
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.chat_models import ChatOllama
from langchain_chroma import Chroma

from langchain_core.prompts import PromptTemplate

# -------------------- APP --------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- LOAD DATA --------------------
print("Loading documents...")

loader = PyPDFLoader(
    r"C:\Users\aadia\Downloads\EET306 -M4 Ktunotes.in (1).pdf"
)

docs = loader.load()

# -------------------- EMBEDDINGS --------------------
print("Loading embeddings...")
embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# -------------------- CHUNKING --------------------
print("Chunking...")
splitter = SemanticChunker(
    embeddings=embedding_model,
    breakpoint_threshold_amount=85,
)
splits = splitter.split_documents(docs)

# -------------------- VECTOR STORE --------------------
print("Building vector store...")
vectorstore = Chroma.from_documents(
    documents=splits,
    embedding=embedding_model,
)

# -------------------- MODEL --------------------
llm = ChatOllama(model="tinyllama", temperature=0)

# -------------------- QUERY EXPANSION --------------------
expand_prompt = PromptTemplate.from_template("""
Generate 3 different rephrasings of the question for better retrieval.

Question:
{question}

Return each on a new line.
""")

def expand_query(question):
    response = llm.invoke(expand_prompt.format(question=question))
    queries = response.content.split("\n")
    return [q.strip() for q in queries if q.strip()]

# -------------------- RETRIEVAL --------------------
def retrieve_docs(question):
    queries = expand_query(question)
    queries.append(question)

    all_docs = []
    for q in queries:
        docs = vectorstore.similarity_search(q, k=3)
        all_docs.extend(docs)

    # remove duplicates
    unique_docs = list({d.page_content: d for d in all_docs}.values())

    return unique_docs[:5]

# -------------------- PROMPT --------------------
prompt = PromptTemplate.from_template("""
You are a strict QA assistant.

Rules:
- Answer ONLY from the context
- If not found, say "I don't know"
- Keep answer within 3 sentences
- Be clear and factual

Context:
{context}

Question:
{question}

Answer:
""")

def format_docs(docs):
    return "\n\n".join(d.page_content for d in docs)

# -------------------- MAIN LOGIC --------------------
def generate_answer(question):
    docs = retrieve_docs(question)

    # DEBUG (optional)
    print("\n--- Expanded Queries ---")
    print(expand_query(question))

    print("\n--- Retrieved Context ---")
    for d in docs:
        print(d.page_content[:200])

    context = format_docs(docs)

    final_prompt = prompt.format(context=context, question=question)
    response = llm.invoke(final_prompt)

    return response.content

# -------------------- API --------------------
class Query(BaseModel):
    question: str

@app.post("/query")
async def query(q: Query):
    answer = generate_answer(q.question)
    return {"reply": answer}

@app.get("/")
def home():
    return {"message": "API is running"}