import os
import numpy as np
import csv
import openai
import pinecone
import sys
from dotenv import load_dotenv
import string

load_dotenv()

INDEX_NAME = "risklog"

# Load CSV data
def read_csv(input_file):
    with open(input_file, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        sections = [row for row in reader]
    return sections

# Helper function to clean non-ASCII characters from the ID
def clean_id(id_text):
    # Replace curly quotes with straight quotes
    id_text = id_text.replace('‘', "'").replace('’', "'")
    
    # Remove any remaining non-ASCII characters
    return ''.join(c for c in id_text if c in string.printable)


# Generate embeddings for the text
def generate_embeddings(records):
    openai.api_key = os.getenv("OPENAI_API_KEY")
    
    embeddings = []

    print(f"Number of records: {len(records)}")

    for i, record in enumerate(records):
        content = record['observation']
        print(f"Processing record: {i + 1}")

        response = openai.Embedding.create(
            input=content,
            model="text-embedding-ada-002"
        )
        
        embedding = response['data'][0]['embedding']

        embeddings.append({
            'id': record['id'],
            'observation': record['observation'],
            'principle': record['principle'],
            'ds_harm': record['ds_harm'],
            'c_harm': record['c_harm'],
            'embedding': embedding
        })

    print(f"Generated embeddings: {len(embeddings)}")

    return embeddings

# Send embeddings to Pinecone
def send_embeddings_to_pinecone(embeddings):
    api_key = os.getenv("PINECONE_API_KEY")
    pinecone.init(api_key=api_key, environment="us-east-1-aws")

    index = pinecone.Index(INDEX_NAME)
    
    upsert_data = []

    for item in embeddings:
        cleaned_id = clean_id(item['id'])
        vector = np.array(item['embedding'])
        metadata = {
            "observation": item['observation'], 
            "principle": item['principle'], 
            "principle": item['principle'], 
            "ds_harm": item['ds_harm'], 
            "c_harm": item['c_harm']
            }
        
        upsert_data.append((cleaned_id, vector.tolist(), metadata))
        
        index.upsert(upsert_data)

    pinecone.init()

# Querying index
def search_index(query, top_k=3):
    MODEL = "text-embedding-ada-002"
    
    # Set the OpenAI API key
    openai.api_key = os.getenv("OPENAI_API_KEY")
    
    # Create the query embedding
    xq = openai.Embedding.create(input=query, engine=MODEL)['data'][0]['embedding']

    # Initialize Pinecone
    api_key = os.getenv("PINECONE_API_KEY")
    pinecone.init(api_key=api_key, environment="us-east-1-aws")
    
    # Create a Pinecone index object
    index = pinecone.Index(INDEX_NAME)

    # Query the index, returning the top k most similar results
    res = index.query(queries=[xq], top_k=top_k, include_metadata=True)
    
    # Deinitialize Pinecone
    pinecone.init()
    
    return res['results'][0]['matches']

# Helper function to print the results
def print_results(matches):
    for match in matches:
        print(f"{match['score']:.2f}: {match['id']} | Observation: {match['metadata']['observation']} (DS Harm: {match['metadata']['ds_harm']} / C Harm: {match['metadata']['c_harm']})")

def upsert_embeddings_from_csv(csv_path):
    records = read_csv(csv_path)
    embeddings = generate_embeddings(records)
    send_embeddings_to_pinecone(embeddings)


def query_index(query):
    results = search_index(query)
    print_results(results)


# Main function
if __name__ == "__main__":
    action = sys.argv[1]
    
    if action == "upsert":
        if len(sys.argv) > 2:
            csv_path = sys.argv[2]
            upsert_embeddings_from_csv(csv_path)
        else:
            print("Please provide the path to the CSV file.")
    elif action == "query":
        if len(sys.argv) > 2:
            query = sys.argv[2]
            query_index(query)
        else:
            print("Please provide a query.")
    else:
        print("Invalid action. Please use 'upsert' or 'query'.")
