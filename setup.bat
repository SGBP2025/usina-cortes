@echo off
chcp 65001 >nul
title Usina de Cortes Virais — Setup
echo.
echo  ╔══════════════════════════════════════════╗
echo  ║   Usina de Cortes Virais — Setup         ║
echo  ╚══════════════════════════════════════════╝
echo.

:: Verificar Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo  [X] Node.js NAO encontrado!
    echo      Baixe em: https://nodejs.org
    echo.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do echo  [OK] Node.js %%i

:: Verificar FFmpeg
set "FFMPEG_FOUND=0"
where ffmpeg >nul 2>nul
if %errorlevel% equ 0 (
    set "FFMPEG_FOUND=1"
    echo  [OK] FFmpeg encontrado no PATH
)

if exist "ffmpeg\ffmpeg.exe" (
    set "FFMPEG_FOUND=1"
    echo  [OK] FFmpeg encontrado em ffmpeg\
)

if "%FFMPEG_FOUND%"=="0" (
    echo.
    echo  [!] FFmpeg NAO encontrado.
    echo      Opcao 1: Instale com "winget install Gyan.FFmpeg"
    echo      Opcao 2: Baixe de https://ffmpeg.org/download.html
    echo               Extraia e coloque a pasta "ffmpeg\" aqui dentro
    echo               (com ffmpeg.exe e ffprobe.exe dentro)
    echo.
)

:: Instalar dependencias npm
echo.
echo  Instalando dependencias...
call npm install --production
echo  [OK] Dependencias instaladas
echo.

:: Verificar .env
if not exist ".env" (
    echo  Criando .env com template...
    (
        echo # ===========================================
        echo # USINA DE CORTES VIRAIS — Configuracao
        echo # ===========================================
        echo.
        echo # OpenAI API Key ^(para Whisper - transcricao^)
        echo # Onde encontrar: platform.openai.com/api-keys
        echo OPENAI_API_KEY=SUA_CHAVE_OPENAI_AQUI
        echo.
        echo # Anthropic API Key ^(para Claude Sonnet - selecao de cortes^)
        echo # Onde encontrar: console.anthropic.com/settings/keys
        echo ANTHROPIC_API_KEY=SUA_CHAVE_ANTHROPIC_AQUI
        echo.
        echo # Porta do servidor ^(opcional^)
        echo PORT=3737
    ) > .env
    echo  [!] IMPORTANTE: Edite o arquivo .env com suas API keys!
    echo      - OPENAI_API_KEY: platform.openai.com/api-keys
    echo      - ANTHROPIC_API_KEY: console.anthropic.com/settings/keys
    notepad .env
) else (
    echo  [OK] .env ja existe
)

echo.
echo  ═══════════════════════════════════════════
echo  Setup concluido! Execute "iniciar.bat" para rodar.
echo  ═══════════════════════════════════════════
echo.
pause
