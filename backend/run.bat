@echo off
echo Compiling TechPlace Core Java Backend...
javac -d bin src/util/*.java src/model/*.java src/repository/*.java src/service/*.java src/controller/*.java src/Main.java
if %ERRORLEVEL% equ 0 (
    echo Starting TechPlace Backend on http://localhost:8080...
    java -cp bin Main
) else (
    echo Compilation failed!
)
