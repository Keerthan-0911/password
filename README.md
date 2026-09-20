# SecurePass — Password Strength Analyzer & Security Dashboard

A professional, enterprise-grade cybersecurity web application built with **Python, Flask, Jinja2, Chart.js, and modern CSS3 Glassmorphism**.

SecurePass analyzes password entropy, evaluates cryptographic complexity requirements, generates uncrackable credentials using hardware-grade entropy (`secrets` / CSPRNG), and tracks historical security posture through zero-knowledge audit trails.

---

## 🚀 Quick Start in VS Code

### 1. Prerequisites
- Python 3.8+ installed on your system
- VS Code (with the Python extension installed)

### 2. Installation
Open your terminal in the project root directory and run:

```bash
# Create and activate virtual environment (optional but recommended)
python -m venv venv

# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Run the Application
Execute the following command in your terminal:

```bash
python app.py
```

The application will automatically start the local development server and open your default browser at:
```text
http://127.0.0.1:5000/
```

---

## 🛡️ Core Security Architecture & Features

1. **Zero-Knowledge Password Analysis**
   - Candidate passwords evaluated in the analyzer are **never stored in plaintext** to memory caches, database tables, or disk.
   - Audit logs store only timestamps, 5-point scores, compliance checks (passed/failed), and recommendations.

2. **CSPRNG Cryptographic Generator**
   - Utilizes Python's `secrets` module (and `window.crypto.getRandomValues`) rather than pseudo-random `random` module.
   - Resists dictionary lookups, rainbow tables, and GPU-accelerated hash collisions.

3. **Enterprise Evaluation Matrix**
   - Minimum 8-character length policy (configurable in Settings).
   - Uppercase `[A-Z]` detection.
   - Lowercase `[a-z]` detection.
   - Numeric `[0-9]` detection.
   - Special symbols `[!@#$%^&*...]` detection.
   - Scoring: `0-2` = Weak, `3-4` = Medium, `5` = Strong.

4. **Analytics & Visualizations**
   - Interactive Chart.js doughnut chart representing portfolio strength distribution.
   - Score distribution histogram (0 to 5).
   - Real-time compliance health percentage index.

5. **Configurable Enterprise Security Policy**
   - Enforce custom minimum length thresholds (6–32 characters).
   - Toggle individual character category mandates.

---

## 📁 Project Structure

```text
SecurePass/
│
├── app.py                     # Primary Flask server and REST API routes
├── requirements.txt           # Python dependency specifications
├── README.md                  # Comprehensive documentation and setup guide
│
├── data/
│   └── history.json           # Zero-knowledge security audit logs
│
├── templates/
│   ├── base.html              # Base master template with sidebar & navbar
│   ├── index.html             # High-impact cybersecurity landing page
│   ├── login.html             # Two-column cybersecurity login & auth screen
│   ├── dashboard.html         # Main SOC overview with 4 metric cards
│   ├── analyze.html           # Live password analyzer with 5-point meter
│   ├── generator.html         # CSPRNG password generator with slider
│   ├── history.html           # Filterable & searchable audit log table
│   ├── statistics.html        # Interactive Chart.js analytics dashboard
│   ├── settings.html          # Policy manager and user preferences
│   └── logout.html            # Session termination confirmation
│
└── static/
    ├── css/
    │   └── style.css          # Cyber dark glassmorphism stylesheet
    └── js/
        ├── main.js            # Sidebar toggle, toasts, notifications
        ├── analyzer.js        # Dynamic real-time analysis engine
        ├── generator.js       # CSPRNG generator logic & clipboard copy
        └── charts.js          # Chart.js security statistics & doughnut graphs
```

---

## 🔑 Authentication & Multi-Platform Execution

### Signing in with Gmail or Operator ID
- **Gmail / Google Sign-In:** Enter any valid Gmail address (e.g. `yourname@gmail.com`) or click **"Continue with Google / Gmail"** to quickly log in.
- **Operator ID:** Use `secops_admin` with password `Admin@2025` (or any custom identifier with >= 4 chars).

### Execution on Desktop & All Browsers
- **Local Desktop:** Clone or copy the files, run `pip install -r requirements.txt`, then `python app.py`. It runs natively on Chrome, Firefox, Safari, Edge, and Arc on Windows, macOS, and Linux.
- **Web & Mobile:** The interface utilizes responsive Tailwind CSS breakpoints and glassmorphism styling, adapting seamlessly to 4K displays, laptop monitors, tablets, and smartphones.
