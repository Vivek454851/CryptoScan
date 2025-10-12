@echo off
echo Starting Cipher Algorithm Detection API...
cd /d "%~dp0"
python -c "import uvicorn; uvicorn.run('app:app', host='127.0.0.1', port=8000, log_level='info')"
pause
