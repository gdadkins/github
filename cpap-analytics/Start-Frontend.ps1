# PowerShell script to start frontend with better error handling
Write-Host "Starting CPAP Analytics Frontend (PowerShell)" -ForegroundColor Green

# Change to frontend directory
Set-Location -Path "C:\github\cpap-analytics\frontend"

# Check Node.js
Write-Host "`nChecking for Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "ERROR: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/"
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green

# Kill existing processes on port 5173
Write-Host "`nChecking for processes on port 5173..." -ForegroundColor Yellow
$processes = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
foreach ($pid in $processes) {
    Write-Host "Killing process $pid"
    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
}

# Clean install function
function Clean-Install {
    Write-Host "`nPerforming clean install..." -ForegroundColor Yellow
    
    # Remove existing files
    if (Test-Path "node_modules") {
        Write-Host "Removing node_modules..."
        Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
    }
    if (Test-Path "package-lock.json") {
        Write-Host "Removing package-lock.json..."
        Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue
    }
    
    # Clear npm cache
    Write-Host "Clearing npm cache..."
    npm cache clean --force
    
    # Install dependencies
    Write-Host "`nInstalling dependencies..."
    npm install --force
    
    # Ensure Windows rollup binary
    Write-Host "`nEnsuring Windows-specific dependencies..."
    npm install @rollup/rollup-win32-x64-msvc@4.41.1 --save-optional --force
}

# Check if clean install is needed
$needsCleanInstall = $false

if (-not (Test-Path "node_modules")) {
    Write-Host "`nnode_modules not found. Clean install required." -ForegroundColor Yellow
    $needsCleanInstall = $true
} else {
    # Test if vite works
    Write-Host "`nTesting existing installation..." -ForegroundColor Yellow
    $testResult = npm list vite 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Existing installation appears corrupted. Clean install required." -ForegroundColor Yellow
        $needsCleanInstall = $true
    } else {
        # Check for Windows rollup binary
        if (-not (Test-Path "node_modules\@rollup\rollup-win32-x64-msvc")) {
            Write-Host "Windows rollup binary missing. Installing..." -ForegroundColor Yellow
            npm install @rollup/rollup-win32-x64-msvc@4.41.1 --save-optional --force
        }
    }
}

if ($needsCleanInstall) {
    Clean-Install
}

# Start the development server
Write-Host "`nStarting development server on http://localhost:5173" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
npm run dev