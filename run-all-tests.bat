@echo off
echo ========================================
echo   Complete Backend Test Suite
echo ========================================
echo.
echo Make sure your dev server is running on http://localhost:3000
echo.
pause
echo.
echo Starting comprehensive tests...
echo.
node --import tsx scripts/test-all-backend.ts > test-results.txt 2>&1
echo.
echo Tests completed! Results saved to test-results.txt
echo.
type test-results.txt
echo.
pause

