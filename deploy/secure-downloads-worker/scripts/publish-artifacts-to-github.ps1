param(
  [Parameter(Mandatory = $true)]
  [string]$SourceDirectory,
  [Parameter(Mandatory = $true)]
  [string]$PrivateRepositoryDirectory
)

$ErrorActionPreference = 'Stop'
$source = Resolve-Path -LiteralPath $SourceDirectory
$repository = Resolve-Path -LiteralPath $PrivateRepositoryDirectory
$destination = Join-Path $repository 'packages'

if (-not (Test-Path -LiteralPath (Join-Path $repository '.git'))) {
  throw 'PrivateRepositoryDirectory deve apontar para um clone Git privado.'
}

New-Item -ItemType Directory -Path $destination -Force | Out-Null

$files = @(
  'vulcan-agent-windows.msi',
  'vulcan-agent-windows-server-x64.msi',
  'vulcan-agent-linux-amd64.deb',
  'vulcan-agent-debian-amd64.deb',
  'vulcan-agent-linux-x86_64.rpm',
  'vulcan-agent-amazon-linux-2023-x86_64.rpm'
)

foreach ($name in $files) {
  $input = Join-Path $source $name
  if (-not (Test-Path -LiteralPath $input)) { throw "Arquivo ausente: $input" }
  Copy-Item -LiteralPath $input -Destination (Join-Path $destination $name) -Force
}

Write-Output 'Artefatos copiados para packages/. Revise os arquivos e use git add/commit/push no repositório privado.'
