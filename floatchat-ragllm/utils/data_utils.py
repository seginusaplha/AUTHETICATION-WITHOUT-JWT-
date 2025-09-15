import os
import pandas as pd
from argopy import DataFetcher
from langchain_community.document_loaders import PDFPlumberLoader
from langchain.schema import Document

def load_argo_data():
    """Fetch ARGO float data and convert to docs + dataframe."""
    print("Loading ARGO float data...")
    # Example float
    argo_data = DataFetcher().float(6902746).load().data
    df = argo_data.to_dataframe().reset_index()

    # Summarize rows into text
    docs = []
    for _, row in df.iterrows():
        summary = (
            f"Cycle {row.get('CYCLE_NUMBER', '')}: "
            f"Temp={row.get('TEMP', '')}, "
            f"Salinity={row.get('PSAL', '')}, "
            f"Pressure={row.get('PRES', '')}, "
            f"Latitude={row.get('LATITUDE', '')}, "
            f"Longitude={row.get('LONGITUDE', '')}, "
            f"Date={row.get('JULD', '')}"
        )
        docs.append(Document(page_content=summary, metadata={"source": "ARGO"}))

    return df, docs


def load_papers(pdf_folder="data/papers"):
    """Load and split research papers."""
    print("Loading research papers...")
    all_docs = []
    for filename in os.listdir(pdf_folder):
        if filename.lower().endswith(".pdf"):
            pdf_path = os.path.join(pdf_folder, filename)
            loader = PDFPlumberLoader(pdf_path)
            all_docs.extend(loader.load())
    return all_docs
