param(
  [string]$Root = (Split-Path -Parent $PSScriptRoot),
  [int]$Port = 8123
)

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Serving $Root on http://localhost:$Port/"

$mime = @{
  ".html"="text/html"; ".htm"="text/html"; ".css"="text/css"; ".js"="application/javascript";
  ".json"="application/json"; ".png"="image/png"; ".jpg"="image/jpeg"; ".jpeg"="image/jpeg";
  ".webp"="image/webp"; ".svg"="image/svg+xml"; ".gif"="image/gif"; ".ico"="image/x-icon";
  ".woff"="font/woff"; ".woff2"="font/woff2"; ".ttf"="font/ttf"; ".otf"="font/otf";
  ".map"="application/json"; ".txt"="text/plain"
}

while ($listener.IsListening) {
  try {
    $context = $listener.GetContext()
    $req = $context.Request
    $res = $context.Response
    $path = [System.Uri]::UnescapeDataString($req.Url.AbsolutePath)
    if ($path -eq "/") { $path = "/index.html" }
    $fullPath = Join-Path $Root ($path.TrimStart("/"))
    $fullPath = [System.IO.Path]::GetFullPath($fullPath)

    if (-not $fullPath.StartsWith([System.IO.Path]::GetFullPath($Root))) {
      $res.StatusCode = 403
      $res.Close()
      continue
    }

    if (Test-Path $fullPath -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
      $contentType = $mime[$ext]
      if (-not $contentType) { $contentType = "application/octet-stream" }
      $bytes = [System.IO.File]::ReadAllBytes($fullPath)
      $res.ContentType = $contentType
      $res.Headers.Add("Cache-Control", "no-store, no-cache, must-revalidate")
      $res.ContentLength64 = $bytes.Length
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $res.StatusCode = 404
      $notFound = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $path")
      $res.OutputStream.Write($notFound, 0, $notFound.Length)
    }
    $res.Close()
  } catch {
    Write-Host "Error: $_"
  }
}
