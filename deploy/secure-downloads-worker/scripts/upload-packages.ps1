param(
  [Parameter(Mandatory = $true)]
  [string]$SourceDirectory
)

$ErrorActionPreference = 'Stop'
$source = Resolve-Path -LiteralPath $SourceDirectory
$root = Split-Path -Parent $PSScriptRoot
$wrangler = Join-Path $root 'node_modules\.bin\wrangler.cmd'

if (-not (Test-Path -LiteralPath $wrangler)) {
  throw 'Instale as dependências do Worker antes de enviar os pacotes: npm install'
}

$files = @(
  @{ Source = 'vulcan-agent-windows.msi'; Destination = 'vulcan-private-downloads/windows/vulcan-agent-windows.msi'; Type = 'application/octet-stream' },
  @{ Source = 'vulcan-agent-windows-server-x64.msi'; Destination = 'vulcan-private-downloads/windows/vulcan-agent-windows-server-x64.msi'; Type = 'application/octet-stream' },
  @{ Source = 'vulcan-agent-linux-amd64.deb'; Destination = 'vulcan-private-downloads/linux/vulcan-agent-linux-amd64.deb'; Type = 'application/vnd.debian.binary-package' },
  @{ Source = 'vulcan-agent-debian-amd64.deb'; Destination = 'vulcan-private-downloads/linux/vulcan-agent-debian-amd64.deb'; Type = 'application/vnd.debian.binary-package' },
  @{ Source = 'vulcan-agent-linux-x86_64.rpm'; Destination = 'vulcan-private-downloads/linux/vulcan-agent-linux-x86_64.rpm'; Type = 'application/x-rpm' },
  @{ Source = 'vulcan-agent-amazon-linux-2023-x86_64.rpm'; Destination = 'vulcan-private-downloads/linux/vulcan-agent-amazon-linux-2023-x86_64.rpm'; Type = 'application/x-rpm' }
)

foreach ($file in $files) {
  $localFile = Join-Path $source $file.Source
  if (-not (Test-Path -LiteralPath $localFile)) { throw "Arquivo ausente: $localFile" }
  & $wrangler r2 object put $file.Destination --file $localFile --content-type $file.Type --remote
  if ($LASTEXITCODE -ne 0) { throw "Falha ao enviar: $($file.Source)" }
}
