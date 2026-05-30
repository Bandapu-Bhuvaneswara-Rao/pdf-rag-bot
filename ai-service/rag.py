from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

from sentence_transformers import SentenceTransformer

import faiss
import numpy as np

from groq import Groq
from dotenv import load_dotenv

import os

load_dotenv()

# Groq client
client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

documents_store = []
index = None

embedding_model = SentenceTransformer('all-MiniLM-L6-v2')


def process_pdf(pdf_path):

    global index
    global documents_store

    loader = PyPDFLoader(pdf_path)

    docs = loader.load()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )

    split_docs = splitter.split_documents(docs)

    texts = [doc.page_content for doc in split_docs]

    embeddings = embedding_model.encode(texts)

    dimension = embeddings.shape[1]

    index = faiss.IndexFlatL2(dimension)

    index.add(np.array(embeddings).astype("float32"))

    documents_store = texts

    return len(texts)


def ask_question(question):

    global index
    global documents_store

    if index is None or len(documents_store) == 0:
        return "Please upload a PDF first."

    try:

        question_embedding = embedding_model.encode([question])

        D, I = index.search(
            np.array(question_embedding).astype("float32"),
            k=5
        )

        retrieved_chunks = []

        for i in I[0]:

            if 0 <= i < len(documents_store):

                retrieved_chunks.append(documents_store[i])

        context = "\n".join(retrieved_chunks)

        print("RETRIEVED CONTEXT:")
        print(context)

        prompt = f"""
You are a resume assistant.

Answer ONLY using the context below.

If answer is not found in context, say:
"Information not found in resume."

Resume Context:
{context}

User Question:
{question}

Give clear and concise answers.
"""

        response = client.chat.completions.create(

            model="llama-3.1-8b-instant",

            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        return response.choices[0].message.content

    except Exception as e:

        return f"Server Error: {str(e)}"