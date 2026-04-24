import os
import sqlite3
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

DB_FILE = "mental_health.db"


# --- Database Initialization ---
def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    # Create the table if it doesn't exist
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS mood_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            mood TEXT,
            note TEXT,
            insight TEXT
        )
    """)
    conn.commit()
    conn.close()


init_db()

# --- Routes ---


@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "online", "database": "connected"})


@app.route("/api/log", methods=["POST"])
def log_mood():
    data = request.json
    mood = data.get("mood")
    note = data.get("note")
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Simple Rule-Based Insight Engine
    insights = {
        "Happy": "That's great! Take a moment to appreciate what made you smile today.",
        "Neutral": "Consistency is key. A steady day is a good day.",
        "Anxious": "Try the 4-7-8 breathing technique: Inhale for 4, hold for 7, exhale for 8.",
        "Sad": "It's okay to not be okay. Consider reaching out to a friend or writing more in your journal.",
    }

    selected_insight = insights.get(
        mood, "Keep tracking to see your patterns over time!"
    )

    # Save to SQLite
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO mood_logs (timestamp, mood, note, insight) VALUES (?, ?, ?, ?)",
        (timestamp, mood, note, selected_insight),
    )
    conn.commit()
    conn.close()

    return jsonify({"status": "success", "insight": selected_insight})


@app.route("/api/history", methods=["GET"])
def get_history():
    """Fetches all logs from the database and returns them as a list of dictionaries."""
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # The 'SELECT' command is the actual retrieval of history
    cursor.execute("SELECT * FROM mood_logs ORDER BY timestamp DESC")
    rows = cursor.fetchall()

    # Converting the SQL rows into a format the Frontend understands (JSON)
    history = [dict(row) for row in rows]

    conn.close()
    return jsonify(history)


@app.route("/api/log/<int:log_id>", methods=["DELETE"])
def delete_log(log_id):
    """
    Deletes a specific mood log entry by its ID.
    Follows RESTful standards for resource removal.
    """
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    # Using parameterized queries to maintain security standards
    cursor.execute("DELETE FROM mood_logs WHERE id = ?", (log_id,))

    conn.commit()
    conn.close()

    return jsonify({"message": f"Log {log_id} deleted successfully"}), 200


if __name__ == "__main__":
    # Bandit-safe debug handling
    debug_mode = os.getenv("FLASK_DEBUG", "False").lower() == "true"
    app.run(debug=debug_mode, port=5000)
