"""
SecurePass — Password Strength Analyzer & Security Dashboard
A professional cybersecurity web application built with Flask.
"""

import os
import re
import json
import secrets
import string
import webbrowser
from datetime import datetime
from threading import Timer
from flask import (
    Flask, render_template, request, redirect, url_for,
    session, jsonify, flash
)

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", secrets.token_hex(32))

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
HISTORY_FILE = os.path.join(DATA_DIR, "history.json")

os.makedirs(DATA_DIR, exist_ok=True)
if not os.path.exists(HISTORY_FILE):
    with open(HISTORY_FILE, "w", encoding="utf-8") as f:
        json.dump([], f)

DEFAULT_POLICY = {
    "min_length": 8,
    "require_upper": True,
    "require_lower": True,
    "require_number": True,
    "require_special": True
}


def load_history():
    try:
        with open(HISTORY_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []


def save_history(history_list):
    try:
        with open(HISTORY_FILE, "w", encoding="utf-8") as f:
            json.dump(history_list, f, indent=2)
    except Exception as e:
        print(f"Error saving history: {e}")


def analyze_password_strength(password, policy=None):
    """
    Analyzes password strength based on standard cybersecurity rules.
    NEVER stores or logs the actual plaintext password.
    """
    if policy is None:
        policy = session.get("password_policy", DEFAULT_POLICY)

    min_len = policy.get("min_length", 8)
    req_upper = policy.get("require_upper", True)
    req_lower = policy.get("require_lower", True)
    req_num = policy.get("require_number", True)
    req_spec = policy.get("require_special", True)

    has_len = len(password) >= min_len
    has_upper = bool(re.search(r"[A-Z]", password)) if req_upper else True
    has_lower = bool(re.search(r"[a-z]", password)) if req_lower else True
    has_number = bool(re.search(r"[0-9]", password)) if req_num else True
    has_special = bool(re.search(r"[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?`~]", password)) if req_spec else True

    score = 0
    if has_len:
        score += 1
    if bool(re.search(r"[A-Z]", password)):
        score += 1
    if bool(re.search(r"[a-z]", password)):
        score += 1
    if bool(re.search(r"[0-9]", password)):
        score += 1
    if bool(re.search(r"[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?`~]", password)):
        score += 1

    # Classify strength according to specs
    if score <= 2:
        strength = "Weak"
        status_class = "weak"
    elif score in (3, 4):
        strength = "Medium"
        status_class = "medium"
    else:
        strength = "Strong"
        status_class = "strong"

    # Dynamic recommendations
    recommendations = []
    if not has_len:
        recommendations.append(f"Increase password length to at least {min_len} characters.")
    if not bool(re.search(r"[A-Z]", password)):
        recommendations.append("Include at least one uppercase letter (A-Z).")
    if not bool(re.search(r"[a-z]", password)):
        recommendations.append("Include at least one lowercase letter (a-z).")
    if not bool(re.search(r"[0-9]", password)):
        recommendations.append("Add at least one numeric digit (0-9).")
    if not bool(re.search(r"[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?`~]", password)):
        recommendations.append("Add at least one special symbol (!@#$%^&*).")

    if not recommendations:
        rec_text = "Excellent! Your password meets all enterprise-grade complexity guidelines."
    else:
        rec_text = " ".join(recommendations)

    # Entropy estimation
    charset_size = 0
    if re.search(r"[a-z]", password):
        charset_size += 26
    if re.search(r"[A-Z]", password):
        charset_size += 26
    if re.search(r"[0-9]", password):
        charset_size += 10
    if re.search(r"[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?`~]", password):
        charset_size += 32

    entropy = round(len(password) * (0 if charset_size == 0 else (charset_size.bit_length())), 1)

    return {
        "score": score,
        "strength": strength,
        "status_class": status_class,
        "checks": {
            "length": has_len,
            "uppercase": bool(re.search(r"[A-Z]", password)),
            "lowercase": bool(re.search(r"[a-z]", password)),
            "number": bool(re.search(r"[0-9]", password)),
            "special": bool(re.search(r"[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?`~]", password))
        },
        "recommendations": rec_text,
        "char_count": len(password),
        "entropy": entropy
    }


def generate_secure_password(length=16, use_upper=True, use_lower=True, use_digits=True, use_symbols=True):
    """
    Generates a cryptographically secure random password using Python's `secrets` module.
    """
    pools = []
    guaranteed = []

    if use_upper:
        pools.append(string.ascii_uppercase)
        guaranteed.append(secrets.choice(string.ascii_uppercase))
    if use_lower:
        pools.append(string.ascii_lowercase)
        guaranteed.append(secrets.choice(string.ascii_lowercase))
    if use_digits:
        pools.append(string.digits)
        guaranteed.append(secrets.choice(string.digits))
    if use_symbols:
        special_chars = "!@#$%^&*()_+-=[]{}|;:,.<>?"
        pools.append(special_chars)
        guaranteed.append(secrets.choice(special_chars))

    if not pools:
        pools = [string.ascii_letters + string.digits]
        guaranteed.append(secrets.choice(string.ascii_letters))

    all_chars = "".join(pools)
    remaining_length = max(0, length - len(guaranteed))
    password_chars = guaranteed + [secrets.choice(all_chars) for _ in range(remaining_length)]

    # Cryptographically secure shuffle using SystemRandom
    sys_rand = secrets.SystemRandom()
    sys_rand.shuffle(password_chars)
    return "".join(password_chars)


# --- Authentication & Session Helpers ---
def is_logged_in():
    return "user" in session


# --- Routes ---

@app.route("/")
def index():
    if is_logged_in():
        return redirect(url_for("dashboard"))
    return render_template("index.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if is_logged_in():
        return redirect(url_for("dashboard"))

    error = None
    if request.method == "POST":
        username = request.form.get("username", "").strip()
        password = request.form.get("password", "")
        remember = request.form.get("remember") == "on"

        # Demonstration credentials or any valid entry (supports any Gmail or custom ID)
        if username and len(password) >= 4:
            display_name = username.split("@")[0] if "@" in username else username
            email_val = username if "@" in username else f"{username.lower()}@gmail.com"
            session["user"] = {
                "username": display_name,
                "email": email_val,
                "role": "Security Analyst"
            }
            if not remember:
                session.permanent = False
            flash(f"Welcome back, {display_name}!", "success")
            return redirect(url_for("dashboard"))
        else:
            error = "Invalid credentials. Please enter a valid username/email and password (min 4 chars)."

    return render_template("login.html", error=error)


@app.route("/register", methods=["GET", "POST"])
def register():
    if is_logged_in():
        return redirect(url_for("dashboard"))

    error = None
    if request.method == "POST":
        username = request.form.get("username", "").strip()
        email = request.form.get("email", "").strip()
        password = request.form.get("password", "")

        if username and len(password) >= 4:
            email_val = email if email else (username if "@" in username else f"{username.lower()}@gmail.com")
            display_name = username.split("@")[0] if "@" in username else username
            session["user"] = {
                "username": display_name,
                "email": email_val,
                "role": "Security Analyst"
            }
            flash(f"Account registered successfully! Welcome to SecurePass, {display_name}.", "success")
            return redirect(url_for("dashboard"))
        else:
            error = "Registration failed. Please provide a username and at least 4-character password."

    return render_template("login.html", error=error, is_register=True)


@app.route("/logout")
def logout():
    session.pop("user", None)
    return render_template("logout.html")


@app.route("/dashboard")
def dashboard():
    if not is_logged_in():
        return redirect(url_for("login"))

    history = load_history()
    total_checks = len(history)
    strong_count = sum(1 for h in history if h.get("strength") == "Strong")
    medium_count = sum(1 for h in history if h.get("strength") == "Medium")
    weak_count = sum(1 for h in history if h.get("strength") == "Weak")

    recent_checks = history[:5] if history else []

    stats = {
        "total": total_checks,
        "strong": strong_count,
        "medium": medium_count,
        "weak": weak_count
    }

    return render_template("dashboard.html", user=session.get("user"), stats=stats, recent_checks=recent_checks)


@app.route("/analyze", methods=["GET", "POST"])
def analyze():
    if not is_logged_in():
        return redirect(url_for("login"))

    result = None
    password_input = ""
    if request.method == "POST":
        password_input = request.form.get("password", "")
        save_log = request.form.get("save_log") == "1"

        if password_input:
            result = analyze_password_strength(password_input)
            if save_log:
                history = load_history()
                entry = {
                    "id": f"chk-{int(datetime.now().timestamp())}-{len(history)+1}",
                    "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                    "score": result["score"],
                    "strength": result["strength"],
                    "status_class": result["status_class"],
                    "checks": result["checks"],
                    "recommendations": result["recommendations"]
                }
                history.insert(0, entry)
                save_history(history)
                flash("Security analysis recorded to history (password itself was never saved).", "success")

    return render_template("analyze.html", user=session.get("user"), result=result)


@app.route("/generator")
def generator():
    if not is_logged_in():
        return redirect(url_for("login"))
    return render_template("generator.html", user=session.get("user"))


@app.route("/history")
def history():
    if not is_logged_in():
        return redirect(url_for("login"))
    history_records = load_history()
    return render_template("history.html", user=session.get("user"), history=history_records)


@app.route("/statistics")
def statistics():
    if not is_logged_in():
        return redirect(url_for("login"))

    records = load_history()
    total = len(records)
    strong = sum(1 for r in records if r.get("strength") == "Strong")
    medium = sum(1 for r in records if r.get("strength") == "Medium")
    weak = sum(1 for r in records if r.get("strength") == "Weak")

    # Score breakdown (0 to 5)
    score_dist = [0, 0, 0, 0, 0, 0]
    for r in records:
        sc = r.get("score", 0)
        if 0 <= sc <= 5:
            score_dist[sc] += 1

    return render_template(
        "statistics.html",
        user=session.get("user"),
        total=total,
        strong=strong,
        medium=medium,
        weak=weak,
        score_dist=score_dist
    )


@app.route("/settings", methods=["GET", "POST"])
def settings():
    if not is_logged_in():
        return redirect(url_for("login"))

    if request.method == "POST":
        action = request.form.get("action")
        if action == "profile":
            new_username = request.form.get("username", "").strip()
            new_email = request.form.get("email", "").strip()
            if new_username:
                session["user"]["username"] = new_username
            if new_email:
                session["user"]["email"] = new_email
            session.modified = True
            flash("Profile updated successfully.", "success")
        elif action == "policy":
            session["password_policy"] = {
                "min_length": int(request.form.get("min_length", 8)),
                "require_upper": request.form.get("require_upper") == "on",
                "require_lower": request.form.get("require_lower") == "on",
                "require_number": request.form.get("require_number") == "on",
                "require_special": request.form.get("require_special") == "on",
            }
            session.modified = True
            flash("Security password policy saved.", "success")

    policy = session.get("password_policy", DEFAULT_POLICY)
    return render_template("settings.html", user=session.get("user"), policy=policy)


# --- AJAX REST APIs ---

@app.route("/api/analyze", methods=["POST"])
def api_analyze():
    data = request.get_json(silent=True) or {}
    password = data.get("password", "")
    save_to_history = data.get("save_to_history", False)

    result = analyze_password_strength(password)

    if save_to_history and password:
        history = load_history()
        entry = {
            "id": f"chk-{int(datetime.now().timestamp())}-{len(history)+1}",
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "score": result["score"],
            "strength": result["strength"],
            "status_class": result["status_class"],
            "checks": result["checks"],
            "recommendations": result["recommendations"]
        }
        history.insert(0, entry)
        save_history(history)
        result["saved"] = True

    return jsonify(result)


@app.route("/api/generate", methods=["POST"])
def api_generate():
    data = request.get_json(silent=True) or {}
    length = int(data.get("length", 16))
    length = max(8, min(50, length))
    use_upper = bool(data.get("uppercase", True))
    use_lower = bool(data.get("lowercase", True))
    use_digits = bool(data.get("numbers", True))
    use_symbols = bool(data.get("symbols", True))

    generated = generate_secure_password(length, use_upper, use_lower, use_digits, use_symbols)
    analysis = analyze_password_strength(generated)

    return jsonify({
        "password": generated,
        "length": len(generated),
        "strength": analysis["strength"],
        "score": analysis["score"],
        "status_class": analysis["status_class"]
    })


@app.route("/api/history/clear", methods=["POST"])
def api_clear_history():
    save_history([])
    return jsonify({"status": "ok", "message": "History successfully cleared."})


def open_browser():
    try:
        webbrowser.open_new("http://127.0.0.1:5000/")
    except Exception as e:
        print(f"Browser launch skipped: {e}")


if __name__ == "__main__":
    print("=" * 60)
    print("  SecurePass — Password Strength Analyzer & Security Dashboard")
    print("  Running locally on http://127.0.0.1:5000/")
    print("  Ready for VS Code execution")
    print("=" * 60)
    Timer(1.0, open_browser).start()
    app.run(debug=True, host="127.0.0.1", port=5000)
