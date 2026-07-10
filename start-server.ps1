$ErrorActionPreference = "Stop"

. "$PSScriptRoot\load-env.ps1"

New-Item -ItemType Directory -Force -Path $LogDir | Out-Null

$existing = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue |
  Where-Object { $_.LocalAddress -eq $HostAddress -or $_.LocalAddress -eq "0.0.0.0" }

if ($existing) {
  "[$(Get-Date -Format s)] Server already listening on ${HostAddress}:${Port}. PID: $($existing.OwningProcess)" |
    Out-File -FilePath $ControlLogFile -Append -Encoding utf8
  exit 0
}

Set-Location $ProjectDir

"[$(Get-Date -Format s)] Starting static server on ${HostAddress}:${Port}" |
  Out-File -FilePath $ControlLogFile -Append -Encoding utf8

$python = (Get-Command python -ErrorAction Stop).Source
$arguments = @("-m", "http.server", "$Port", "--bind", "$HostAddress")

Start-Process `
  -FilePath $python `
  -ArgumentList $arguments `
  -WorkingDirectory $ProjectDir `
  -RedirectStandardOutput $ServerLogFile `
  -RedirectStandardError $ErrorLogFile `
  -WindowStyle Hidden | Out-Null

Start-Sleep -Milliseconds 500

$started = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue |
  Where-Object { $_.LocalAddress -eq $HostAddress -or $_.LocalAddress -eq "0.0.0.0" }

if (-not $started) {
  throw "Static server did not start on ${HostAddress}:${Port}."
}

"[$(Get-Date -Format s)] Static server started. PID: $($started.OwningProcess)" |
  Out-File -FilePath $ControlLogFile -Append -Encoding utf8
