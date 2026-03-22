<#
.SYNOPSIS
    Automated script to build the Next.js frontend, copy it to Spring Boot static resources, and start the Spring Boot server.

.DESCRIPTION
    This script streamlines the local development workflow for the Galaxy English Website.
    It performs the following steps:
    1. Kills any process currently running on port 8080 (Spring Boot's default port).
    2. Builds the Next.js application (static export) located in frontend/galaxy-english-app.
    3. Cleans the Spring Boot src/main/resources/static/ directory.
    4. Copies the newly built Next.js static files to the Spring Boot static directory.
    5. Starts the Spring Boot application using Maven Wrapper (mvnw).

.EXAMPLE
    .\deploy_local.ps1
#>

$ErrorActionPreference = "Stop"
$ProjectRoot = $PSScriptRoot
$FrontendPath = Join-Path $ProjectRoot "frontend\galaxy-english-app"
$StaticResourcePath = Join-Path $ProjectRoot "src\main\resources\static"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "🚀 GALAXY ENGLISH SITE - DEPLOY SCRIPT 🚀" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Step 1: Kill process on port 8080
Write-Host "`n[1/5] Checking for existing servers on port 8080..." -ForegroundColor Yellow
$processOn8080 = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
if ($processOn8080) {
    Write-Host "Found process(es) on port 8080. Killin' 'em..." -ForegroundColor Yellow
    $processOn8080 | ForEach-Object { 
        taskkill /F /PID $_.OwningProcess 2>$null 
    }
    Start-Sleep -Seconds 2
} else {
    Write-Host "Port 8080 is free." -ForegroundColor Green
}

# Step 2: Build Next.js
Write-Host "`n[2/5] Building Next.js Frontend (static export)..." -ForegroundColor Yellow
Set-Location $FrontendPath
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Frontend build failed. See output for details."
    exit 1
}

# Step 3: Clean static directory
Write-Host "`n[3/5] Cleaning Spring Boot static directory..." -ForegroundColor Yellow
if (Test-Path $StaticResourcePath) {
    Remove-Item -Path "$StaticResourcePath\*" -Recurse -Force
} else {
    New-Item -ItemType Directory -Path $StaticResourcePath | Out-Null
}

# Step 4: Copy static files
Write-Host "`n[4/5] Copying fresh frontend files to Spring Boot..." -ForegroundColor Yellow
Copy-Item -Path "out\*" -Destination $StaticResourcePath -Recurse -Force

# Step 5: Start Spring Boot
Write-Host "`n[5/5] Starting Spring Boot Server..." -ForegroundColor Yellow
Set-Location $ProjectRoot
Write-Host "Server will be available at http://localhost:8080/" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop." -ForegroundColor Gray
Write-Host "------------------------------------------`n" -ForegroundColor Cyan

.\mvnw spring-boot:run
