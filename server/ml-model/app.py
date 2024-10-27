from flask import Flask, request, jsonify
from flask_cors import CORS
from joblib import load
import pandas as pd
import fitz  # PyMuPDF
from sklearn.metrics import accuracy_score

app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "http://localhost:3000"}})

# Load your model once at startup
model = load('./decision_tree_model_pruned.joblib')

def extract_data_from_pdf(file):
    pdf_document = fitz.open(stream=file.read(), filetype="pdf")
    text = pdf_document[0].get_text("text")
    pdf_document.close()

    # Initialize the soil data dictionary
    soil_data = {
        "N": 0,
        "P": 0,
        "K": 0,
        "temperature": 0,
        "humidity": 0,
        "ph": 7.0,
        "rainfall": 0
    }

    for line in text.splitlines():
        if ":" in line:
            parts = line.split(":")
            key, value = parts[0].strip(), parts[1].strip().split()[0]

            try:
                if "Nitrogen (N)" in key:
                    soil_data["N"] = float(value)
                elif "Phosphorus (P)" in key:
                    soil_data["P"] = float(value)
                elif "Potassium (K)" in key:
                    soil_data["K"] = float(value)
                elif "Temperature" in key:
                    soil_data["temperature"] = float(value.replace("°C", ""))
                elif "Humidity" in key:
                    soil_data["humidity"] = float(value.replace("%", ""))
                elif "pH" in key:
                    soil_data["ph"] = float(value)
                elif "Rainfall" in key:
                    soil_data["rainfall"] = float(value)
            except ValueError:
                continue

    return soil_data

@app.route('/predict', methods=['POST'])
def predict_from_pdf():
    file = request.files.get('file')
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    soil_data = extract_data_from_pdf(file)
    input_df = pd.DataFrame([soil_data])
    prediction = model.predict(input_df)[0]

    return jsonify({'predicted_crop': prediction, 'soilData': soil_data})

@app.route('/accuracy', methods=['GET'])
def get_accuracy():
    test_data = pd.read_csv('./crop_data.csv')
    X_test = test_data.drop(columns=['label'])
    y_test = test_data['label']
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)

    return jsonify({'accuracy_score': accuracy})

if __name__ == '__main__':
    app.run(debug=True)
