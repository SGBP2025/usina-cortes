@echo off
chcp 65001 >nul
title Usina de Cortes Virais

:: Verificar se node_modules existe
if not exist "node_modules" (
    echo  Primeira execucao — rodando setup...
    call setup.bat
)

:: Verificar .env
if not exist ".env" (
    echo  [X] Arquivo .env nao encontrado! Rode setup.bat primeiro.
    pause
    exit /b 1
)

echo.
echo  Iniciando Usina de Cortes Virais...
echo  Abrindo navegador em 3 segundos...
echo.

:: Iniciar servidor e abrir navegador
start "" /b node server.js
timeout /t 3 /nobreak >nul
start http://localhost:3737

echo  Servidor rodando em http://localhost:3737
echo  Pressione Ctrl+C para parar.
echo.

:: Manter janela aberta com o servidor
node server.js
