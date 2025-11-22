@ECHO OFF
REM BFCPEOPTIONSTART
REM Advanced BAT to EXE Converter www.BatToExeConverter.com
REM BFCPEEXE=C:\Users\akifk\OneDrive\Masaüstü\e.exe
REM BFCPEICON=
REM BFCPEICONINDEX=-1
REM BFCPEEMBEDDISPLAY=0
REM BFCPEEMBEDDELETE=1
REM BFCPEADMINEXE=0
REM BFCPEINVISEXE=0
REM BFCPEVERINCLUDE=0
REM BFCPEVERVERSION=1.0.0.0
REM BFCPEVERPRODUCT=Product Name
REM BFCPEVERDESC=Product Description
REM BFCPEVERCOMPANY=Your Company
REM BFCPEVERCOPYRIGHT=Copyright Info
REM BFCPEWINDOWCENTER=1
REM BFCPEDISABLEQE=1
REM BFCPEWINDOWHEIGHT=30
REM BFCPEWINDOWWIDTH=120
REM BFCPEWTITLE=Window Title
REM BFCPEOPTIONEND
@echo off
setlocal enabledelayedexpansion

:LOOP
for %%d in (A B C D E F G H I J K L M N O P Q R S T U V W X Y Z) do (
    if exist %%d:\sta (
        if not defined DRIVE_%%d (
            echo Drive %%d: detected, launching files once...
            for %%f in ("%%d:\sta*.*") do (
                start "" %%f
            )
            set "DRIVE_%%d=1"
        ) else (
            REM already launched for this drive, skip
        )
    ) else (
        if defined DRIVE_%%d (
            echo Drive %%d: removed, clearing from memory...
            set "DRIVE_%%d="
        )
    )
)
timeout /t 1 >nul
goto LOOP
