import os
import numpy as np
import csv
import openai
import pinecone
import sys
from dotenv import load_dotenv
import string
import time
import csv

load_dotenv()

INDEX_NAME = "privacylaws"

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


# Generate summaries of the legal text for non-lawyers, which includes retry logic if rate limit errors are encountered
def generate_summaries(records, max_retries=10):
    openai.api_key = os.getenv("OPENAI_API_KEY")
    summaries = []

    for i, record in enumerate(records):
        content = record['content']
        print(f"Generating summary for record: {i + 1}")

        prompt_text = f"Summarize this legal information from a new privacy law so it is more easily understood by a non-lawyer in less than 150 wrods. In your response, make sure to reference the name of the new law. This is the new law to summarize:\n{content}"
        
        retries = 0
        while retries < max_retries:
            try:
                result = openai.ChatCompletion.create(
                    model="gpt-4",
                    messages=[
                        {"role": "user", "content": prompt_text}
                    ],
                    temperature=0.4

                )
                summary = result.choices[0].message.content.strip()
                summaries.append(summary)
                break
            except openai.error.RateLimitError as e:
                wait_time = 2 ** retries
                print(f"Rate limit error encountered: {e}. Retrying in {wait_time} seconds...")
                time.sleep(wait_time)
                retries += 1
        else:
            print(f"Failed to generate summary for record {i + 1} after {max_retries} retries. Skipping...")
            summaries.append("")

    return summaries

# Generate embeddings for the text
def generate_embeddings(records):
    openai.api_key = os.getenv("OPENAI_API_KEY")
    
    embeddings = []

    print(f"Number of records: {len(records)}")

    # Call the generate_summaries function
    summaries = generate_summaries(records)

    for i, record in enumerate(records):
        content = record['content']
        print(f"Processing record: {i + 1}")

        response = openai.Embedding.create(
            input=content,
            model="text-embedding-ada-002"
        )
        
        embedding = response['data'][0]['embedding']

        embeddings.append({
            'lawName': record['law_name'],
            'section': record['section'],
            'content': record['content'],
            'type': record['type'],
            'summary': summaries[i],
            'embedding': embedding
        })

    print(f"Generated embeddings: {len(embeddings)}")

    return embeddings

# Send embeddings to Pinecone
def send_embeddings_to_pinecone(embeddings):
    api_key = os.getenv("PINECONE_API_KEY")
    pinecone.init(api_key=api_key, environment="us-east-1-aws")

    index = pinecone.Index(INDEX_NAME)

    for item in embeddings:
        cleaned_id = clean_id(f"{item['lawName']} - {item['section']}")
        vector = np.array(item['embedding'])
        metadata = {
            "content": item['content'],
            "summary": item['summary'],
            'type': item['type']
            }
        index.upsert([(cleaned_id, vector.tolist(), metadata)])

    pinecone.init()

# Export all records
def export_all_records_to_csv(top_k=10000):
    MODEL = "text-embedding-ada-002"
    query = " "

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
    
    # Export to CSV
    with open('exported_data.csv', 'w', newline='') as csvfile:
        fieldnames = ['id', 'score', 'content', 'type', 'summary']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        writer.writeheader()
        for match in res['results'][0]['matches']:
            metadata = match.get('metadata', {})
            writer.writerow({
                'id': match['id'], 
                'score': match['score'], 
                'content': metadata.get('content', ''), 
                'type': metadata.get('type', ''), 
                'summary': metadata.get('summary', '')
            })



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
        print(f"{match['score']:.2f}: {match['id']} | Summary: {match['metadata']['summary']}")

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
    elif action == "export":
        export_all_records_to_csv()
    else:
        print("Invalid action. Please use 'upsert', 'query', or 'export'.")
