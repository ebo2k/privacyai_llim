# To start server for development use the startFlaskServer.py file, by running python startFlaskServer.py in the terminal.

import sys
import os
import numpy as np
import csv
import openai
import pinecone
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS, cross_origin
import traceback

from dotenv import load_dotenv
import string
import json

load_dotenv()

# Flask server that receives the prompt text from the frontend
app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "http://localhost:3000"}})

# Endpoint that the front end will send the prompt text to
@app.route('/api/query_embeddings', methods=['POST'])
def query_embeddings():
    print("Received request from frontend")
    try:
        data = request.get_json()
        prompt = data['prompt']
        index_name = data['index_name']  # Get the index name from the request data
        print("Received prompt from frontend:", prompt)

        # Get the filter from the request data, if it exists
        filter = data.get('filter', None)

        # Query the Pinecone index with the prompt, filter, and the received index name
        results = search_index(prompt, index_name, filter)
        response = make_response(jsonify(results))
        print("Sending response to frontend:", results)
        response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'

        return response
    except Exception as e:
        print(traceback.format_exc())
        return make_response(jsonify({"error": str(e)}), 500)


def search_index(prompt, index_name, filter=None, top_k=10): 
    MODEL = "text-embedding-ada-002"

    print("OPENAI_API_KEY:", os.getenv("OPENAI_API_KEY"))
    openai.api_key = os.getenv("OPENAI_API_KEY")

    xq = openai.Embedding.create(input=prompt, engine=MODEL)['data'][0]['embedding']
    print("Query embedding")

    api_key = os.getenv("PINECONE_API_KEY")
    pinecone.init(api_key=api_key, environment="us-east-1-aws")
    print("Pinecone initialized")

    # Use the received index name
    index = pinecone.Index(index_name)
    print("Pinecone index object search")

    # Query parameters
    query_params = {
        "queries": [xq],
        "top_k": top_k,
        "include_metadata": True
    }

    # Include filter if provided
    if filter is not None:
        query_params["filter"] = filter

    res = index.query(**query_params)
    print("Query sent...")
    print("Pinecone query response:", res)

    # ... the rest of your code ...


    # Format results based on index_name
    if index_name == 'risklog':
        formatted_results = [
            f"{i + 1}. {match['metadata']['observation']} [{match['metadata']['principle']}]. This has a {match['metadata']['ds_harm']} Data Subject Harm and {match['metadata']['c_harm']} Controller Harm."
            for i, match in enumerate(res['results'][0]['matches'])
        ]
    if index_name == 'privacyrequirements':
        formatted_results = [
            f"{i + 1}. {match['id']} | Product: {match['metadata']['product']} | Privacy Requirement: {match['metadata']['privacy_requirement']}"
            for i, match in enumerate(res['results'][0]['matches'])
        ]
    elif index_name == 'privacylaws':
        formatted_results = [
            f"{i + 1}. Law: {match['id']} - Summary: {match['metadata']['summary']}."
            for i, match in enumerate(res['results'][0]['matches'])
        ]
    else:
        formatted_results = [str(match) for match in res['results'][0]['matches']]

    pinecone.init()

    app.logger.info("Pinecone formatted response: ", formatted_results)
    return formatted_results



# Main function
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001, debug=True)
