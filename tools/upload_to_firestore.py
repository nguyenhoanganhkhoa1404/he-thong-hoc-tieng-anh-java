import firebase_admin
from firebase_admin import credentials, firestore
import json

# 1. Khởi tạo Firebase với file JSON của ông (nhớ để đúng đường dẫn nhé)
cred = credentials.Certificate("firebase-service-account.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# 2. Đọc file data.json
with open('data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

def upload_data():
    for collection_name, documents in data.items():
        print(f"🚀 Đang đẩy dữ liệu vào collection: {collection_name}...")
        collection_ref = db.collection(collection_name)
        
        for doc in documents:
            # Thêm mới document (Firebase tự sinh ID)
            collection_ref.add(doc)
            
    print("✅ Xong rồi Ritchi ơi! Data đã lên mây hết rồi.")

if __name__ == "__main__":
    upload_data()