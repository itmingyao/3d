$EnvFile = Join-Path $PSScriptRoot ".env"

if (Test-Path -LiteralPath $EnvFile) {
  Get-Content -LiteralPath $EnvFile | ForEach-Object {
    $line = $_.Trim()
    if (-not $line -or $line.StartsWith("#")) {
      return
    }

    $parts = $line -split "=", 2
    if ($parts.Count -ne 2) {
      return
    }

    $name = $parts[0].Trim()
    $value = $parts[1].Trim().Trim('"').Trim("'")
    Set-Item -Path "Env:$name" -Value $value
  }
}

$script:ProjectDir = if ($env:PROJECT_DIR) { $env:PROJECT_DIR } else { $PSScriptRoot }
$script:HostAddress = if ($env:STATIC_HOST) { $env:STATIC_HOST } else { "127.0.0.1" }
$script:Port = if ($env:STATIC_PORT) { [int]$env:STATIC_PORT } else { 8000 }
$script:LogDir = if ($env:STATIC_LOG_DIR) {
  if ([System.IO.Path]::IsPathRooted($env:STATIC_LOG_DIR)) {
    $env:STATIC_LOG_DIR
  } else {
    Join-Path $ProjectDir $env:STATIC_LOG_DIR
  }
} else {
  Join-Path $ProjectDir ".server"
}
$script:ServerLogFile = Join-Path $LogDir $(if ($env:STATIC_LOG_FILE) { $env:STATIC_LOG_FILE } else { "static-server.log" })
$script:ErrorLogFile = Join-Path $LogDir "static-server.err.log"
$script:ControlLogFile = Join-Path $LogDir "server-control.log"
