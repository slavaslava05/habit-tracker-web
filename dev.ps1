# Запуск dev-сервера, если npm не в PATH (после установки Node перезапустите терминал)
$nodeDir = "C:\Program Files\nodejs"
if (Test-Path $nodeDir) {
  $env:Path = "$nodeDir;$env:Path"
}
Set-Location $PSScriptRoot
npm run dev
