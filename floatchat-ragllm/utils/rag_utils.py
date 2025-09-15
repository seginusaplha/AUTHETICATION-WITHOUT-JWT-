import google.generativeai as genai
from utils.config import LLM_MODEL
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS as LangFAISS
from langchain_huggingface import HuggingFaceEmbeddings

embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
embedder = embeddings
PROMPT_TEMPLATE = """
You are an oceanographic assistant. Use the provided context to answer the user question.

Context:
{context}

Question:
{question}

Answer in two parts:
1. A clear natural language explanation (the story).
2. A JSON object called "data_points" that lists the ARGO cycles and their fields
   (Cycle, Temp, Salinity, Pressure, Latitude, Longitude, Date) relevant to your answer.

If the question is theoretical and does not require ARGO data, return "data_points": [].
"""

def build_faiss_index(argo_docs, paper_docs, index_dir="floatchat-ragllm/faiss_index"):
    """Create FAISS vector store from ARGO + paper docs."""
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    split_paper_docs = splitter.split_documents(paper_docs)

    all_docs_final = argo_docs + split_paper_docs
    vector_store = LangFAISS.from_documents(all_docs_final, embedder)
    vector_store.save_local(index_dir)
    return vector_store.as_retriever(search_type="similarity", search_kwargs={"k": 3})
    
def ask_llm(question, retriever):
    """Run query through retriever + Gemini model and return story + structured ARGO data."""
    retrieved_docs = retriever.invoke(question)
    context_text = "\n\n".join(
        f"Content: {doc.page_content}\nSource: {doc.metadata.get('source', '')}"
        for doc in retrieved_docs
    )

    prompt = PROMPT_TEMPLATE.format(context=context_text, question=question)
    llm = genai.GenerativeModel(model_name=LLM_MODEL)
    response = llm.generate_content(prompt)

    if not response.text:
        return {"answer": "I don't know.", "sources": [], "data_points": []}

    # Try parsing JSON inside the response
    try:
        text = response.text.strip()
        if "```json" in text:
            json_part = text.split("```json")[1].split("```")[0]
        elif "{\n" in text:
            json_part = text[text.index("{"):]
        else:
            json_part = '{"data_points": []}'

        import json
        parsed = json.loads(json_part)
        data_points = parsed.get("data_points", [])
    except Exception:
        data_points = []

    sources = [doc.metadata.get("source", "") for doc in retrieved_docs]

    return {
        "answer": response.text.strip(),
        "sources": sources,
        "data_points": data_points
    }
