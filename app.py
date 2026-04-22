from flask import Flask, jsonify, request
from flask_cors import CORS

# 1. Initialize the Flask application
app = Flask(__name__)

# 2. Enable Cross-Origin Resource Sharing (CORS)
# This is vital for the 'Bridge'—it allows your React app (on Port 3000)
# to talk to this Python server (on Port 5000).
CORS(app)


# 3. Simple 'Insight Engine' Logic (Placeholder)
def get_mood_insight(mood):
    """
    Business Logic: Processes a mood log and returns supportive text.
    In the BSc report, this represents the 'Insight Engine' module.
    """
    insights = {
        "happy": "That's wonderful! Reflect on what made you smile today.",
        "anxious": "Try the 5-4-3-2-1 grounding technique. You are safe.",
        "sad": "It is okay to feel this way. Treat yourself with kindness.",
        "tired": "Rest is productive. Your body is asking for a recharge.",
    }
    return insights.get(
        mood.lower(), "Thank you for sharing how you feel. I am here to listen."
    )


# 4. API Endpoints
@app.route("/api/health", methods=["GET"])
def health_check():
    """
    Used for DORA Measurement: Ensures the service is reachable.
    """
    return jsonify({"status": "online", "version": "1.0.0", "engine": "Python/Flask"})


@app.route("/api/insight", methods=["GET"])
def bridge_test():
    """
    The 'Hello World Bridge' endpoint.
    React will call this to verify the connection.
    """
    return jsonify(
        {
            "status": "success",
            "message": "Bridge established! The Insight Engine is communicating.",
            "advice": get_mood_insight("happy"),  # Defaulting to happy for the test
        }
    )


# 5. Run the Application
if __name__ == "__main__":
    # Running on Port 5000 as it is standard for Flask development
    app.run(debug=True, port=5000)
