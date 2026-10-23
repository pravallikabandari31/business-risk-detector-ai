# Riskwise — Business Risk Detector AI

A responsive AI chatbot for small-business risk analysis, built with HTML, CSS, JavaScript, Python, and FastAPI. It helps users explore possible operational, financial, supplier, customer, cybersecurity, compliance, and reputation risks.

## Features

- Modern responsive dashboard and chat interface
- AI-generated, practical business-risk guidance
- Suggested prompts for common business challenges
- Clear screen / start a new analysis controls
- Each API request sends **only the current message**; prior chat messages are not sent as context
- No chat-history database and no browser-side chat-history persistence
- API key stays on the backend in `.env`, not in frontend code
- Health check at `/health`

## Privacy behavior

This app does not write conversations to a database or to browser storage. Messages stay visible in the currently open page until you clear the screen or refresh/close the page. Each new AI request sends only the latest message, not the earlier conversation. The AI provider and hosting/network infrastructure may process request data under their own policies, so avoid entering confidential business information or personal data.

## Requirements

- Python 3.10 or newer
- An API key for the OpenAI API
- VS Code (recommended for beginners)

## Run in VS Code on Windows

1. Extract the ZIP file.
2. In VS Code, select **File → Open Folder** and choose the `business-risk-detector-ai` folder (the folder containing `requirements.txt`).
3. Open **Terminal → New Terminal**.
4. Create a virtual environment:

   ```powershell
   py -m venv .venv
   ```

5. Activate it in PowerShell:

   ```powershell
   .\.venv\Scripts\Activate.ps1
   ```

   If PowerShell blocks activation, you can use Command Prompt in VS Code and run:

   ```bat
   .venv\Scripts\activate.bat
   ```

6. Install dependencies:

   ```powershell
   python -m pip install --upgrade pip
   python -m pip install -r requirements.txt
   ```

7. Create a `.env` file in the project root by copying `.env.example`. Open `.env` and replace `your_api_key_here` with your own API key. Keep `.env` private and never upload it to GitHub.
8. Start the server:

   ```powershell
   python -m uvicorn app.main:app --reload
   ```

9. Open `http://127.0.0.1:8000` in your browser.
10. To stop the server, click the terminal and press `Ctrl+C`.

### macOS / Linux

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
# Create .env from .env.example and add your API key
python -m uvicorn app.main:app --reload
```

## Configuration

`.env` settings:

```env
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4.1-mini
```

Use a model name available to your API account. Restart the server after changing `.env`.

## Troubleshooting

- **`python` or `py` not found:** Install Python 3.10+ and enable the option to add Python to PATH, then restart VS Code.
- **`No module named fastapi` or another dependency:** Activate `.venv` and run `python -m pip install -r requirements.txt` again.
- **PowerShell activation error:** Use the Command Prompt activation command shown above.
- **AI says the API key is not configured:** Check that `.env` is in the same root folder as `requirements.txt`, the key is correct, and the server was restarted.
- **Could not connect to backend:** Keep the Uvicorn terminal running and visit the local URL above.
- **AI request fails:** Check API key validity, account access/billing, and the configured model name.

## Health check

Open `http://127.0.0.1:8000/health`. A running app should return a JSON status response.

## Deployment

Deploy to a Python hosting service that supports FastAPI. Use this start command if the provider supplies a `PORT` environment variable:

```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
```

Configure `OPENAI_API_KEY` and `OPENAI_MODEL` as private environment variables in the hosting provider's settings. Never put the API key in HTML, CSS, JavaScript, or a public GitHub repository.

## Important

AI output may be inaccurate. Verify important financial, legal, compliance, and business decisions with qualified professionals. This project is a helpful starting point, not a professional audit or guarantee of business outcomes.
