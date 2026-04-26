@echo off
echo 🏥 Starting MediRemind Email Scheduler...
echo.
echo This will send automatic email reminders at scheduled times.
echo Press Ctrl+C to stop the scheduler.
echo.
cd backend
node reminder-scheduler.js
pause