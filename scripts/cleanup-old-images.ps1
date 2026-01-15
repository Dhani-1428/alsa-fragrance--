# Script to remove old product images, keeping only uploaded ones and essential UI images

$publicPath = "public"
$uploadsPath = "public/uploads"

# Images to keep (essential UI images and uploaded product images)
$imagesToKeep = @(
    "alsa-logo.png",
    "alsa-logo1.png",
    "placeholder-logo.png",
    "placeholder-logo.svg",
    "placeholder-user.jpg",
    "placeholder.jpg",
    "placeholder.svg",
    "for her hero img.png",
    "shop hero img.png",
    "contact hero img.png"
)

# Get all uploaded product images
$uploadedImages = Get-ChildItem -Path $uploadsPath -File | Select-Object -ExpandProperty Name

Write-Host "Cleaning up old product images..."
Write-Host "Keeping essential UI images and uploaded product images..."

# Get all image files in public folder
$allImages = Get-ChildItem -Path $publicPath -File -Include *.jpg,*.png,*.svg | Where-Object { $_.DirectoryName -eq (Resolve-Path $publicPath).Path }

$removedCount = 0
$keptCount = 0

foreach ($image in $allImages) {
    $imageName = $image.Name
    $shouldKeep = $false
    
    # Check if it's in the keep list
    if ($imagesToKeep -contains $imageName) {
        $shouldKeep = $true
    }
    
    # Check if it's a hero/logo/placeholder image
    if ($imageName -like "*hero*" -or $imageName -like "*logo*" -or $imageName -like "*placeholder*" -or $imageName -like "*contact*" -or $imageName -like "*shop*") {
        $shouldKeep = $true
    }
    
    if (-not $shouldKeep) {
        Write-Host "Removing: $imageName"
        Remove-Item -Path $image.FullName -Force
        $removedCount++
    } else {
        $keptCount++
    }
}

Write-Host ""
Write-Host "Cleanup complete!"
Write-Host "Removed: $removedCount images"
Write-Host "Kept: $keptCount images"
