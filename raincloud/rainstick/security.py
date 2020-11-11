from raincloud.rainstick.config import app_config
import hashlib

def pwhash(pw):
    return hashlib.sha256(bytes(pw, 'utf-8')).hexdigest()

def authenticate(pw):
    user_password_hashed = open(app_config['path_to_password_hash_file']).read().replace(' -\n', '').strip()
    return pwhash(pw) == user_password_hashed

def chpass(pw):
    with open(app_config['path_to_password_hash_file'], "w") as f:
        f.write(pwhash(pw))
