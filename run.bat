
@echo off
setlocal

title Agriculture Portal Launcher
color 0A

echo ===================================================
echo           AGRICULTURE PORTAL LAUNCHER
echo ===================================================
echo.

REM Project directory
set "PROJECT_DIR=%~dp0"

REM JDK 21 - Project specific Java
set "JAVA_HOME=D:\Java\jdk-21"
set "PATH=%JAVA_HOME%\bin;%PATH%"

REM Maven location
set "MAVEN_CMD=D:\apache-maven-3.9.9\bin\mvn.cmd"

REM Check JDK 21
if not exist "%JAVA_HOME%\bin\java.exe" (
    echo ERROR: JDK 21 not found at:
    echo %JAVA_HOME%
    pause
    exit /b 1
)

echo Java Version:
"%JAVA_HOME%\bin\java.exe" -version
echo.

REM Check Backend
if not exist "%PROJECT_DIR%backend\pom.xml" (
    echo ERROR: Backend pom.xml not found!
    pause
    exit /b 1
)

REM Check Frontend
if not exist "%PROJECT_DIR%frontend\package.json" (
    echo ERROR: Frontend package.json not found!
    pause
    exit /b 1
)

REM Check Maven
if not exist "%MAVEN_CMD%" (
    echo ERROR: Maven not found at:
    echo %MAVEN_CMD%
    pause
    exit /b 1
)

REM Check Node.js and npm
where npm >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js/npm is not installed or not in PATH.
    pause
    exit /b 1
)

echo Starting Spring Boot Backend with JDK 21...
start "Agriculture Portal - Backend" cmd /k "set JAVA_HOME=%JAVA_HOME%&& set PATH=%JAVA_HOME%\bin;%PATH%&& "%MAVEN_CMD%" -f "%PROJECT_DIR%backend\pom.xml" spring-boot:run"

echo Starting React Frontend...
start "Agriculture Portal - Frontend" cmd /k "cd /d "%PROJECT_DIR%frontend" && npm run dev"

echo.
echo ===================================================
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:5173
echo Java:     JDK 21
echo ===================================================

timeout /t 5 /nobreak >nul
start http://localhost:5173

endlocal