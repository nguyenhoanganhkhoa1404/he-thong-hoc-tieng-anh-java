$ErrorActionPreference = "Stop"

Write-Host "============================="
Write-Host "TESTING LOCAL MYSQL JWT AUTH"
Write-Host "============================="

$baseUrl = "http://localhost:8080/api/auth"

# Generate a random email to avoid duplicate error
$rand = Get-Random -Minimum 1000 -Maximum 9999
$email = "testuser$rand@example.com"
$password = "Password123!"

<# 1. TEST REGISTRATION #>
Write-Host "`n[1] Bắt đầu test API Register..." -ForegroundColor Cyan
$regBody = @{
    email = $email
    password = $password
    displayName = "Test Learner"
} | ConvertTo-Json

try {
    $regResponse = Invoke-RestMethod -Uri "$baseUrl/register" -Method Post -Body $regBody -ContentType "application/json"
    Write-Host "--> Xong! Đăng ký thành công:" -ForegroundColor Green
    Write-Host ($regResponse | Out-String)
} catch {
    Write-Host "--> Lỗi đăng ký: $_" -ForegroundColor Red
    exit
}

<# 2. TEST LOGIN & GET JWT #>
Write-Host "`n[2] Bắt đầu test API Login..." -ForegroundColor Cyan
$loginBody = @{
    email = $email
    password = $password
} | ConvertTo-Json

$token = ""
try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/login" -Method Post -Body $loginBody -ContentType "application/json"
    Write-Host "--> Xong! Đăng nhập thành công, nhận được Access Token:" -ForegroundColor Green
    $token = $loginResponse.token
    Write-Host "Token: $token"
} catch {
    Write-Host "--> Lỗi đăng nhập: $_" -ForegroundColor Red
    exit
}

<# 3. TEST PROTECTED ROUTE /ME #>
Write-Host "`n[3] Bắt đầu test kết nối bảo mật bằng Token (lấy thông tin User hiện tại)..." -ForegroundColor Cyan
$headers = @{
    Authorization = "Bearer $token"
}

try {
    $meResponse = Invoke-RestMethod -Uri "$baseUrl/me" -Method Get -Headers $headers
    Write-Host "--> Truy cập thành công. Thông tin của bạn:" -ForegroundColor Green
    Write-Host ($meResponse | Out-String)
} catch {
    Write-Host "--> Lỗi xác thực token: $_" -ForegroundColor Red
    exit
}

Write-Host "`n=================================================" -ForegroundColor Magenta
Write-Host "CHÚC MỪNG! JWT AUTH BẰNG MYSQL ĐÃ HOẠT ĐỘNG 100%!" -ForegroundColor Magenta
Write-Host "=================================================" -ForegroundColor Magenta
