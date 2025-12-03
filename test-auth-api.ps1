# Script para probar los endpoints de autenticación en PowerShell

Write-Host "===================================" -ForegroundColor Cyan
Write-Host "Probando API de Autenticación" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# URL base de la API
$API_URL = "http://localhost:3001"

# Test 1: Health Check
Write-Host "Test 1: Health Check" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$API_URL/health" -Method Get
    $response | ConvertTo-Json
    Write-Host "✓ Health check exitoso" -ForegroundColor Green
} catch {
    Write-Host "✗ Error en health check: $_" -ForegroundColor Red
}
Write-Host ""

# Test 2: Registro de usuario
Write-Host "Test 2: Registro de Usuario" -ForegroundColor Yellow
$registerBody = @{
    email = "test@example.com"
    password = "password123"
    nombre = "Test"
    apellidos = "Usuario"
    telefono = "123456789"
    ciudad = "Madrid"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$API_URL/api/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
    $registerResponse | ConvertTo-Json
    $token = $registerResponse.token
    Write-Host "✓ Registro exitoso" -ForegroundColor Green
    Write-Host "Token: $token" -ForegroundColor Cyan
} catch {
    Write-Host "✗ Error en registro: $_" -ForegroundColor Red
    $token = $null
}
Write-Host ""

# Test 3: Login
Write-Host "Test 3: Login" -ForegroundColor Yellow
$loginBody = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$API_URL/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $loginResponse | ConvertTo-Json
    $token = $loginResponse.token
    Write-Host "✓ Login exitoso" -ForegroundColor Green
    Write-Host "Token: $token" -ForegroundColor Cyan
} catch {
    Write-Host "✗ Error en login: $_" -ForegroundColor Red
}
Write-Host ""

# Test 4: Obtener perfil de usuario (requiere token)
if ($token) {
    Write-Host "Test 4: Obtener Perfil de Usuario" -ForegroundColor Yellow
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    try {
        $profileResponse = Invoke-RestMethod -Uri "$API_URL/api/usuarios/me" -Method Get -Headers $headers
        $profileResponse | ConvertTo-Json
        Write-Host "✓ Perfil obtenido exitosamente" -ForegroundColor Green
    } catch {
        Write-Host "✗ Error obteniendo perfil: $_" -ForegroundColor Red
    }
    Write-Host ""
}

# Test 5: Intentar login con credenciales incorrectas
Write-Host "Test 5: Login con Credenciales Incorrectas" -ForegroundColor Yellow
$wrongLoginBody = @{
    email = "test@example.com"
    password = "wrongpassword"
} | ConvertTo-Json

try {
    $wrongLoginResponse = Invoke-RestMethod -Uri "$API_URL/api/auth/login" -Method Post -Body $wrongLoginBody -ContentType "application/json"
    Write-Host "✗ No debería haber funcionado" -ForegroundColor Red
} catch {
    Write-Host "✓ Correctamente rechazado: $_" -ForegroundColor Green
}
Write-Host ""

# Test 6: Intentar registro con email duplicado
Write-Host "Test 6: Registro con Email Duplicado" -ForegroundColor Yellow
try {
    $duplicateRegisterResponse = Invoke-RestMethod -Uri "$API_URL/api/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
    Write-Host "✗ No debería permitir email duplicado" -ForegroundColor Red
} catch {
    Write-Host "✓ Correctamente rechazado email duplicado: $_" -ForegroundColor Green
}
Write-Host ""

# Test 7: Intentar acceder sin token
Write-Host "Test 7: Acceder a Ruta Protegida sin Token" -ForegroundColor Yellow
try {
    $noTokenResponse = Invoke-RestMethod -Uri "$API_URL/api/usuarios/me" -Method Get
    Write-Host "✗ No debería permitir acceso sin token" -ForegroundColor Red
} catch {
    Write-Host "✓ Correctamente rechazado sin token: $_" -ForegroundColor Green
}
Write-Host ""

Write-Host "===================================" -ForegroundColor Cyan
Write-Host "Pruebas completadas" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
