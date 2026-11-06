<#
.SYNOPSIS
    The Secret Word - Local API & Web Server (Zero-install PowerShell Server)
#>

param(
    [int]$Port = 8080
)

$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $baseDir) { $baseDir = Get-Location }

$dataPath = Join-Path $baseDir "data\game_data.json"
$gameData = (Get-Content -Path $dataPath -Raw -Encoding UTF8) | ConvertFrom-Json

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
} catch {
    $Port = 8085
    $prefix = "http://localhost:$Port/"
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add($prefix)
    $listener.Start()
}

Write-Host "`n========================================================" -ForegroundColor Yellow
Write-Host "   The Secret Word Game Server is RUNNING!             " -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Yellow
Write-Host "  Game Home:      $prefix" -ForegroundColor Cyan
Write-Host "  API Docs:       $($prefix)doc" -ForegroundColor Cyan
Write-Host "  API Combo:      $($prefix)api/combo" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop.`n" -ForegroundColor Gray

function Get-RandomTopicItem($category = "all", $level = "all") {
    $pool = @()
    $cats = $gameData.categories
    $targetCats = @()
    if ($category -eq "all") {
        foreach ($prop in $cats.PSObject.Properties.Name) {
            $targetCats += $cats.$prop
        }
    } elseif ($cats.$category) {
        $targetCats += $cats.$category
    } else {
        $targetCats += $cats.fun
    }

    foreach ($c in $targetCats) {
        if (-not $c.levels) { continue }
        if ($level -eq "all") {
            foreach ($lProp in $c.levels.PSObject.Properties.Name) {
                $pool += @($c.levels.$lProp)
            }
        } elseif ($c.levels.$level) {
            $pool += @($c.levels.$level)
        }
    }

    if ($pool.Count -eq 0) {
        return @{
            topic = "Why cereal is technically a cold soup"
            relatedWords = @("chemistry", "recipe", "liquid", "chef")
        }
    }
    return ($pool | Get-Random)
}

function Get-RandomWordForTopic($topicItem) {
    if ($topicItem -and $topicItem.relatedWords -and $topicItem.relatedWords.Count -gt 0) {
        return ($topicItem.relatedWords | Get-Random)
    }
    return ($gameData.words | Get-Random)
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $response.Headers.Add("Access-Control-Allow-Origin", "*")
        $response.Headers.Add("Access-Control-Allow-Methods", "GET, OPTIONS")
        $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type")
        
        if ($request.HttpMethod -eq "OPTIONS") {
            $response.StatusCode = 204
            $response.Close()
            continue
        }
        
        $path = $request.Url.AbsolutePath
        $query = $request.QueryString
        
        if ($path -eq "/api/combo") {
            $cat = if ($query["category"]) { $query["category"] } else { "all" }
            $lvl = if ($query["level"]) { $query["level"] } else { "all" }
            $topicItem = Get-RandomTopicItem -category $cat -level $lvl
            $topic = if ($topicItem.topic) { $topicItem.topic } else { "$topicItem" }
            $word = Get-RandomWordForTopic -topicItem $topicItem
            
            $payload = [ordered]@{
                "success" = $true
                "data" = [ordered]@{
                    "topic" = $topic
                    "word" = $word.ToUpper()
                    "category" = $cat
                    "level" = $lvl
                    "rules" = "Speak on '$topic' and sneak the word '$($word.ToUpper())' into your speech at least 3 times!"
                }
                "timestamp" = (Get-Date).ToString("o")
            }
            
            $jsonStr = $payload | ConvertTo-Json -Depth 5
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($jsonStr)
            $response.ContentType = "application/json; charset=utf-8"
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            $response.Close()
            continue
        }
        
        # Static files & rewrites
        $localPath = if ($path -eq "/" -or $path -eq "") { 
            "index.html" 
        } elseif ($path -eq "/doc" -or $path -eq "/doc/") {
            "doc.html"
        } else { 
            $path.TrimStart("/") 
        }
        
        $localFilePath = Join-Path $baseDir $localPath
        
        if (Test-Path $localFilePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($localFilePath).ToLower()
            $mime = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".json" { "application/json; charset=utf-8" }
                default { "application/octet-stream" }
            }
            
            $bytes = [System.IO.File]::ReadAllBytes($localFilePath)
            $response.ContentType = $mime
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.Close()
        } else {
            $response.StatusCode = 404
            $errBuffer = [System.Text.Encoding]::UTF8.GetBytes('{"error": "Not Found"}')
            $response.ContentType = "application/json; charset=utf-8"
            $response.ContentLength64 = $errBuffer.Length
            $response.OutputStream.Write($errBuffer, 0, $errBuffer.Length)
            $response.Close()
        }
    } catch {
        Write-Warning "Error: $_"
    }
}
