import os
import subprocess

os.environ['FLASK_APP'] = 'pineconeQuery.py'
os.environ['FLASK_ENV'] = 'development'

command = 'flask run --host=0.0.0.0 --port=5001'

subprocess.run(command, shell=True, check=True)