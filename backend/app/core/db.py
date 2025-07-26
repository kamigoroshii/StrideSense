import firebase_admin
from firebase_admin import credentials, auth, firestore
import os
from dotenv import load_dotenv

cred_path = os.getenv("FIREBASE_CREDENTIALS", "firebase-key.json")

if not firebase_admin._apps:
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()
