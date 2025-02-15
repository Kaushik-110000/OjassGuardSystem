from flask import Flask, request, jsonify
import pickle
from flask_cors import CORS 
import numpy as np
import pandas as pd

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load the trained ML model (Ensure the correct path to the .pkl file)
model_path = "feedback_rating_model.pkl"  # Change this if needed
with open(model_path, "rb") as model_file:
    model = pickle.load(model_file)

@app.route("/")
def home():
    return "ML Model API is running!"

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Get JSON data from request
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No input data received"}), 400
        
        predictions = []
        
        for entry in data:
            guard_id = entry["guard_id"]  # Extract Guard ID
            features = [
                entry["Complaints"],
                entry["Shift_Completion_Percentage"],
                entry["Appreciations"],
                entry["Work_Experience_Years"]
            ]

            # Convert to NumPy array and reshape for prediction
            features_array = np.array(features).reshape(1, -1)
            
            # Predict using the model
            rating = model.predict(features_array)[0]

            # Append result with Guard ID
            predictions.append({"guard_id": guard_id, "predicted_rating": rating})

        return jsonify(predictions)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":  
    app.run(debug=True, host="0.0.0.0", port=5000)  

