<#
.SYNOPSIS
    Builds the Ghost theme upload zip from ./theme into ./dist/milos-portfolio-theme.zip.

.DESCRIPTION
    Writes zip entries with forward slashes. Windows PowerShell 5.1 Compress-Archive
    writes backslashes, which Ghost does not unpack as folders.
    The zip name must stay "milos-portfolio-theme.zip": Ghost uses the file name as the theme name.
#>
param(
    [string]$ThemeDir = (Join-Path $PSScriptRoot '..\theme'),
    [string]$OutDir   = (Join-Path $PSScriptRoot '..\dist')
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$ThemeDir = (Resolve-Path $ThemeDir).Path
$version  = (Get-Content (Join-Path $ThemeDir 'package.json') -Raw | ConvertFrom-Json).version

New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
$zipPath = Join-Path (Resolve-Path $OutDir).Path 'milos-portfolio-theme.zip'
if (Test-Path $zipPath) { Remove-Item $zipPath }

$zip = [System.IO.Compression.ZipFile]::Open($zipPath, [System.IO.Compression.ZipArchiveMode]::Create)
try {
    Get-ChildItem -Path $ThemeDir -Recurse -File | ForEach-Object {
        $relative = $_.FullName.Substring($ThemeDir.Length).TrimStart('\', '/') -replace '\\', '/'
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
            $zip, $_.FullName, $relative, [System.IO.Compression.CompressionLevel]::Optimal
        ) | Out-Null
    }
}
finally {
    $zip.Dispose()
}

Write-Host "Built $zipPath (theme v$version)"
