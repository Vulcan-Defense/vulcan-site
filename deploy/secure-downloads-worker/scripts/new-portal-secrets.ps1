$password = Read-Host 'Defina a senha do portal' -AsSecureString
$pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
try {
  $plain = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
  $salt = New-Object byte[] 16
  [Security.Cryptography.RandomNumberGenerator]::Fill($salt)
  $iterations = 210000
  $hash = [Security.Cryptography.Rfc2898DeriveBytes]::Pbkdf2($plain, $salt, $iterations, [Security.Cryptography.HashAlgorithmName]::SHA256, 32)
  $session = New-Object byte[] 32
  [Security.Cryptography.RandomNumberGenerator]::Fill($session)
  $base64Url = { param([byte[]]$bytes) ([Convert]::ToBase64String($bytes).TrimEnd('=').Replace('+','-').Replace('/','_')) }
  Write-Output "DOWNLOAD_PASSWORD_HASH=$iterations`:$(& $base64Url $salt):$(& $base64Url $hash)"
  Write-Output "SESSION_SECRET=$(& $base64Url $session)"
} finally {
  if ($pointer -ne [IntPtr]::Zero) { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer) }
}
