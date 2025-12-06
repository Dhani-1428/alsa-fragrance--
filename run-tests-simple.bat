@echo off
echo ========================================
echo   Backend Test Suite - Simple Version
echo ========================================
echo.
echo Make sure your dev server is running on http://localhost:3000
echo.
pause
echo.
echo Starting tests...
echo.
node --import tsx scripts/test-backend-simple.ts
echo.
echo Tests completed!
pause

