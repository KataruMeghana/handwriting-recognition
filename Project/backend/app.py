from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import pytesseract
import numpy as np
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Set Tesseract Path (Update if needed)
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def preprocess_image(image_path):
    """Preprocess image for better OCR"""
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    return thresh

@app.route('/upload', methods=['POST'])
def upload_image():
    """Upload image and extract text"""
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    processed_img = preprocess_image(file_path)
    text = pytesseract.image_to_string(processed_img, config='--psm 6')

    return jsonify({"recognized_text": text.strip()})

if __name__ == '__main__':
    app.run(debug=True)
