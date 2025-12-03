#!/bin/bash

# Script para probar los endpoints de autenticación

echo "==================================="
echo "Probando API de Autenticación"
echo "==================================="
echo ""

# URL base de la API
API_URL="http://localhost:3001"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo -e "${YELLOW}Test 1: Health Check${NC}"
curl -s "$API_URL/health" | jq .
echo ""
echo ""

# Test 2: Registro de usuario
echo -e "${YELLOW}Test 2: Registro de Usuario${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "nombre": "Test",
    "apellidos": "Usuario",
    "telefono": "123456789",
    "ciudad": "Madrid"
  }')

echo "$REGISTER_RESPONSE" | jq .

# Extraer token si el registro fue exitoso
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.token // empty')

if [ -n "$TOKEN" ]; then
  echo -e "${GREEN}✓ Registro exitoso${NC}"
  echo "Token: $TOKEN"
else
  echo -e "${RED}✗ Error en registro${NC}"
fi
echo ""
echo ""

# Test 3: Login
echo -e "${YELLOW}Test 3: Login${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

echo "$LOGIN_RESPONSE" | jq .

# Extraer token del login
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token // empty')

if [ -n "$TOKEN" ]; then
  echo -e "${GREEN}✓ Login exitoso${NC}"
  echo "Token: $TOKEN"
else
  echo -e "${RED}✗ Error en login${NC}"
fi
echo ""
echo ""

# Test 4: Obtener perfil de usuario (requiere token)
if [ -n "$TOKEN" ]; then
  echo -e "${YELLOW}Test 4: Obtener Perfil de Usuario${NC}"
  curl -s "$API_URL/api/usuarios/me" \
    -H "Authorization: Bearer $TOKEN" | jq .
  echo ""
  echo ""
fi

# Test 5: Intentar login con credenciales incorrectas
echo -e "${YELLOW}Test 5: Login con Credenciales Incorrectas${NC}"
curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "wrongpassword"
  }' | jq .
echo ""
echo ""

# Test 6: Intentar registro con email duplicado
echo -e "${YELLOW}Test 6: Registro con Email Duplicado${NC}"
curl -s -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "nombre": "Test",
    "apellidos": "Usuario",
    "telefono": "123456789",
    "ciudad": "Madrid"
  }' | jq .
echo ""
echo ""

# Test 7: Intentar acceder sin token
echo -e "${YELLOW}Test 7: Acceder a Ruta Protegida sin Token${NC}"
curl -s "$API_URL/api/usuarios/me" | jq .
echo ""
echo ""

echo "==================================="
echo "Pruebas completadas"
echo "==================================="
