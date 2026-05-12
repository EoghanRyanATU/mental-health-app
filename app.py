import os
import sqlite3
import re
from collections import Counter
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

DB_FILE = "mental_health.db"


def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn


# --- Database Initialization ---
def init_db():
    with get_db_connection() as conn:
        # 1. Credentials Table
        conn.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL
            )
        """)

        # 2. Main Data Table (Updated with user_id)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS mood_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL, 
                mood TEXT NOT NULL,
                note TEXT,
                insight TEXT,
                sleep_hours INTEGER DEFAULT 0,
                exercise BOOLEAN DEFAULT 0,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        """)
        conn.commit()


# --- FR3: Insight Engine ---
def get_mood_insight(mood, sleep, exercise):
    messages = []
    if sleep < 5:
        messages.append("You're low on sleep! Try to prioritize a nap.")
    if not exercise:
        messages.append("A bit of light movement might help boost your mood.")

    mood_insights = {
        "Happy": "That's great! Take a moment to appreciate what made you smile.",
        "Neutral": "Consistency is key. A steady day is a good day.",
        "Anxious": "Try the 4-7-8 breathing technique to ground yourself.",
        "Sad": "It's okay to not be okay. Consider reaching out to a friend.",
    }
    messages.append(mood_insights.get(mood, "Keep tracking to see your patterns!"))
    return " ".join(messages)


# --- AUTHENTICATION ROUTES ---


@app.route("/api/auth/signup", methods=["POST"])
def signup():
    data = request.json
    username, password = data.get("username"), data.get("password")
    if not username or not password:
        return jsonify({"error": "Missing credentials"}), 400

    hashed_pw = generate_password_hash(password)
    try:
        with get_db_connection() as conn:
            conn.execute(
                "INSERT INTO users (username, password_hash) VALUES (?, ?)",
                (username, hashed_pw),
            )
            conn.commit()
        return jsonify({"status": "success"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Username already exists"}), 400


@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.json
    username, password = data.get("username"), data.get("password")
    with get_db_connection() as conn:
        user = conn.execute(
            "SELECT * FROM users WHERE username = ?", (username,)
        ).fetchone()

    if user and check_password_hash(user["password_hash"], password):
        # We now return the user_id so the frontend can "tag" future requests
        return (
            jsonify({"status": "success", "username": username, "user_id": user["id"]}),
            200,
        )
    return jsonify({"error": "Invalid username or password"}), 401


# --- DATA ROUTES (Now Filtered by user_id) ---


@app.route("/api/log", methods=["POST"])
def log_mood():
    data = request.json
    user_id = data.get("user_id")  # Identify who is saving this
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    mood, note, sleep = data.get("mood"), data.get("note"), data.get("sleep_hours", 0)
    exercise = data.get("exercise", False)
    selected_insight = get_mood_insight(mood, sleep, exercise)

    with get_db_connection() as conn:
        conn.execute(
            "INSERT INTO mood_logs (user_id, mood, note, insight, sleep_hours, exercise) VALUES (?, ?, ?, ?, ?, ?)",
            (user_id, mood, note, selected_insight, sleep, exercise),
        )
        conn.commit()
    return jsonify({"status": "success", "insight": selected_insight}), 201


@app.route("/api/health", methods=["GET"])
def health_check():
    # This is the "Ping" the frontend looks for to turn the dot green
    return jsonify({"status": "online", "database": "connected"}), 200


@app.route("/api/history", methods=["GET"])
def get_history():
    user_id = request.args.get("user_id")  # Only get logs for this user
    search = request.args.get("q", "")

    with get_db_connection() as conn:
        if search:
            query = "SELECT * FROM mood_logs WHERE user_id = ? AND (note LIKE ? OR mood LIKE ?) ORDER BY timestamp DESC"
            rows = conn.execute(
                query, (user_id, f"%{search}%", f"%{search}%")
            ).fetchall()
        else:
            rows = conn.execute(
                "SELECT * FROM mood_logs WHERE user_id = ? ORDER BY timestamp DESC",
                (user_id,),
            ).fetchall()
    return jsonify([dict(row) for row in rows]), 200


@app.route("/api/stats/advanced", methods=["GET"])
def get_advanced_stats():
    user_id = request.args.get("user_id")
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            exercise_mood = cursor.execute(
                "SELECT exercise, COUNT(*) as total, SUM(CASE WHEN mood IN ('Happy', 'happy') THEN 1 ELSE 0 END) as happy_count FROM mood_logs WHERE user_id = ? GROUP BY exercise",
                (user_id,),
            ).fetchall()
            peak_query = cursor.execute(
                "SELECT STRFTIME('%H', timestamp) as hour FROM mood_logs WHERE user_id = ? AND timestamp IS NOT NULL GROUP BY hour ORDER BY COUNT(*) DESC LIMIT 1",
                (user_id,),
            ).fetchone()
            streak = cursor.execute(
                "SELECT COUNT(DISTINCT DATE(timestamp)) FROM mood_logs WHERE user_id = ?",
                (user_id,),
            ).fetchone()[0]

        return (
            jsonify(
                {
                    "exercise_impact": [dict(row) for row in exercise_mood],
                    "peak_hour": peak_query["hour"] if peak_query else "N/A",
                    "streak": streak or 0,
                }
            ),
            200,
        )
    except:
        return jsonify({"exercise_impact": [], "peak_hour": "N/A", "streak": 0}), 200


@app.route("/api/stats/sleep-correlation", methods=["GET"])
def get_sleep_correlation():
    user_id = request.args.get("user_id")  # Get the tag from the URL
    with get_db_connection() as conn:
        query = "SELECT mood, AVG(sleep_hours) as avg_sleep FROM mood_logs WHERE user_id = ? GROUP BY mood"
        rows = conn.execute(query, (user_id,)).fetchall()
        correlation = {row["mood"].title(): round(row["avg_sleep"], 1) for row in rows}
    return jsonify(correlation), 200


@app.route("/api/stats/word-cloud", methods=["GET"])
def get_word_cloud():
    user_id = request.args.get("user_id")
    try:
        with get_db_connection() as conn:
            rows = conn.execute(
                "SELECT note FROM mood_logs WHERE user_id = ? AND note IS NOT NULL",
                (user_id,),
            ).fetchall()
            text = " ".join([row["note"].lower() for row in rows if row["note"]])
            words = re.findall(r"\b\w{4,}\b", text)
            stop_words = {
                "with",
                "this",
                "that",
                "from",
                "have",
                "just",
                "feel",
                "felt",
                "been",
                "today",
                "really",
                "very",
            }
            filtered = [w for w in words if w not in stop_words]
            cloud_data = [
                {"text": word, "value": count}
                for word, count in Counter(filtered).most_common(15)
            ]
        return jsonify(cloud_data), 200
    except:
        return jsonify([]), 200


@app.route("/api/log/<int:log_id>", methods=["PUT", "DELETE"])
def handle_log_action(log_id):
    with get_db_connection() as conn:
        if request.method == "PUT":
            conn.execute(
                "UPDATE mood_logs SET note = ? WHERE id = ?",
                (request.json.get("note"), log_id),
            )
        else:
            conn.execute("DELETE FROM mood_logs WHERE id = ?", (log_id,))
        conn.commit()
    return jsonify({"status": "success"}), 200


if __name__ == "__main__":
    init_db()
    app.run(debug=True, port=5000)
