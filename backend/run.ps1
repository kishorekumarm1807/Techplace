Write-Host "Compiling TechPlace Core Java Backend..." -ForegroundColor Cyan
javac -d bin src/util/*.java src/model/*.java src/repository/*.java src/service/*.java src/controller/*.java src/Main.java
if ($LASTEXITCODE -eq 0) {
    Write-Host "Starting TechPlace Backend on http://localhost:8080..." -ForegroundColor Green
    java -cp bin Main
} else {
    Write-Host "Compilation failed!" -ForegroundColor Red
}
