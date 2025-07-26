from fastapi import Depends, HTTPException, Header
from firebase_admin import auth as firebase_auth

def verify_token(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, detail="Missing or invalid Authorization header")
    id_token = authorization.split(" ")[1]
    try:
        decoded_token = firebase_auth.verify_id_token(id_token)
    except Exception:
        raise HTTPException(401, detail="Invalid token")
    return decoded_token   # Has 'uid' which is your user_id
