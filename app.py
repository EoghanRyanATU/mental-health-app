import os
import sqlite3
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DB_FILE = "mental_health.db"


def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn


# Section 3.3.4: Database Initialization
def init_db():
    with get_db_connection() as conn:
        # Maintaining Activity Tags (FR4) and Insight storage
        conn.execute("""
            CREATE TABLE IF NOT EXISTS mood_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                mood TEXT NOT NULL,
                note TEXT,
                insight TEXT,
                sleep_hours INTEGER DEFAULT 0,
                exercise BOOLEAN DEFAULT 0,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()


# Rule-Based Insight Engine Logic (FR3)
def get_mood_insight(mood, sleep, exercise):
    messages = []

    # 1. Behavioral Rule: Sleep
    if sleep < 5:
        messages.append(
            "You're low on sleep! Try to prioritize a nap or an earlier bedtime."
        )

    # 2. Behavioral Rule: Exercise
    if not exercise:
        messages.append("A bit of light movement might help boost your mood.")

    # 3. Emotional Rule: Mood
    mood_insights = {
        "Happy": "That's great! Take a moment to appreciate what made you smile today.",
        "Neutral": "Consistency is key. A steady day is a good day.",
        "Anxious": "Try the 4-7-8 breathing technique: Inhale for 4, hold for 7, exhale for 8.",
        "Sad": "It's okay to not be okay. Consider reaching out to a friend or writing in your journal.",
    }
    messages.append(mood_insights.get(mood, "Keep tracking to see your patterns!"))

    # Join all collected advice into one string
    return " ".join(messages)


@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "online", "database": "connected"}), 200


@app.route("/api/log", methods=["POST"])
def log_mood():
    data = request.json
    mood = data.get("mood")
    note = data.get("note")
    sleep = data.get("sleep_hours", 0)
    exercise = data.get("exercise", False)

    # Process through the Insight Engine (FR3)
    selected_insight = get_mood_insight(mood, sleep, exercise)

    # Save to SQLite (FR7)
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO mood_logs (mood, note, insight, sleep_hours, exercise) VALUES (?, ?, ?, ?, ?)",
            (mood, note, selected_insight, sleep, exercise),
        )
        conn.commit()

    return jsonify({"status": "success", "insight": selected_insight}), 201


@app.route("/api/history", methods=["GET"])
def get_history():
    with get_db_connection() as conn:
        cursor = conn.cursor()
        rows = cursor.execute(
            "SELECT * FROM mood_logs ORDER BY timestamp DESC"
        ).fetchall()
    return jsonify([dict(row) for row in rows]), 200


@app.route("/api/log/<int:log_id>", methods=["DELETE"])
def delete_log(log_id):
    with get_db_connection() as conn:
        conn.execute("DELETE FROM mood_logs WHERE id = ?", (log_id,))
        conn.commit()
    return jsonify({"message": f"Log {log_id} deleted successfully"}), 200


@app.route("/api/history/wipe", methods=["DELETE"])
def wipe_history():
    with get_db_connection() as conn:
        conn.execute("DELETE FROM mood_logs")
        conn.commit()
    return jsonify({"status": "success", "message": "All logs deleted"}), 200


if __name__ == "__main__":
    # Bandit-safe debug handling
    debug_mode = os.getenv("FLASK_DEBUG", "False").lower() == "true"
    app.run(debug=debug_mode, port=5000)