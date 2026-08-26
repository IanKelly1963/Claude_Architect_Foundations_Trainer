@echo off
REM ===================================================================
REM  CCAR-F Architect Trainer - guaranteed-persistence launcher
REM
REM  Claude_Architect_Trainer.html works by double-clicking it in
REM  Chrome or Edge, which allow local storage for local files.
REM  Some browsers (and some security policies) block storage on
REM  file:// origins, which would silently lose your scores.
REM
REM  This script serves the folder on http://localhost instead, where
REM  storage works in every browser. Use it if the app shows the
REM  "Progress cannot be saved in this browser" banner.
REM
REM  Close this window when you have finished studying.
REM ===================================================================

setlocal
cd /d "%~dp0"
set PORT=8731

where python >nul 2>&1 && set PY=python
if not defined PY where py >nul 2>&1 && set PY=py
if not defined PY (
  echo.
  echo   Python was not found on this machine.
  echo   Open Claude_Architect_Trainer.html directly in Chrome or Edge instead.
  echo.
  pause
  exit /b 1
)

echo.
echo   Serving on http://localhost:%PORT%/Claude_Architect_Trainer.html
echo   Keep this window open while you study. Close it when finished.
echo.

start "" "http://localhost:%PORT%/Claude_Architect_Trainer.html"
%PY% -m http.server %PORT% --bind 127.0.0.1
endlocal
