$ErrorActionPreference = "Stop"

. "$PSScriptRoot\load-env.ps1"

$connections = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue

if (-not $connections) {
  Write-Host "No static server is listening on port $Port."
  exit 0
}

$pids = $connections | Select-Object -ExpandProperty OwningProcess -Unique

foreach ($pidValue in $pids) {
  $process = Get-Process -Id $pidValue -ErrorAction SilentlyContinue
  if ($process -and $process.ProcessName -eq "python") {
    Stop-Process -Id $pidValue -Force
    Write-Host "Stopped static server process $pidValue."
  } else {
    Write-Host "Port $Port is owned by PID $pidValue, not a python static server. Skipped."
  }
}
