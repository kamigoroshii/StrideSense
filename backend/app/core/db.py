import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, auth, firestore

load_dotenv()

# You can control the path via environment variable or hardcode the absolute or relative path
cred_path = os.getenv("FIREBASE_CREDENTIALS", "/app/firebase-key.json")

if not os.path.isfile(cred_path):
    raise FileNotFoundError(f"Firebase credentials file not found at: {cred_path}")

if not firebase_admin._apps:
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()
