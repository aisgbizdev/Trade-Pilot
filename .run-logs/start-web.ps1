$root = "c:\laragon\www\Trade-Pilot"
Get-Content (Join-Path $root ".env") | ForEach-Object { if ($_ -match '^\s*#' -or $_ -match '^\s*$') { return }; $parts = $_ -split '=',2; if ($parts.Length -eq 2) { [Environment]::SetEnvironmentVariable($parts[0].Trim(), $parts[1].Trim().Trim('"'), 'Process') } }
[Environment]::SetEnvironmentVariable('NODE_ENV','development','Process')
[Environment]::SetEnvironmentVariable('PORT','5173','Process')
[Environment]::SetEnvironmentVariable('BASE_PATH','/','Process')
Set-Location $root
pnpm.cmd --filter @workspace/ai-trading run dev
