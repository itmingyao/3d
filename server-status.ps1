. "$PSScriptRoot\load-env.ps1"

$Url = "http://${HostAddress}:$Port/"

$connections = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue

if ($connections) {
  $connections | Select-Object LocalAddress, LocalPort, State, OwningProcess | Format-Table
} else {
  Write-Host "No process is listening on port $Port."
}

try {
  $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 3
  Write-Host "HTTP $($response.StatusCode): $Url"
} catch {
  Write-Host "Request failed: $($_.Exception.Message)"
}
