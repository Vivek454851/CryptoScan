@echo off
echo Starting CryptoScan Application...
echo.

echo Starting ML API Server...
start "ML API" cmd /k "cd ml_api && python -c \"import uvicorn; uvicorn.run('app:app', host='127.0.0.1', port=8000, log_level='info')\""

echo Waiting for ML API to start...
timeout /t 5 /nobreak > nul

echo Starting Frontend Server...
start "Frontend" cmd /k "cd CryptoScan && npm run dev"

echo.
echo Both servers are starting...
echo ML API: http://127.0.0.1:8000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause > nul
