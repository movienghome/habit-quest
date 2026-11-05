# 해비티카틱 · 할 일 빠른 추가 창을 Ctrl+Shift+A 에 연결하는 설치 파일
# 하는 일: 시작 메뉴에 '해비티카틱 빠른 추가' 바로 가기를 하나 만들고, 그 바로 가기에 Ctrl+Shift+A 를 붙여요.
# 지우려면: 시작 메뉴 폴더(아래에 나오는 경로)에서 '해비티카틱 빠른 추가' 를 지우면 돼요.
$url = 'https://movienghome.github.io/habit-quest/beta/?quick=1'   # 본 앱으로 옮기면 /beta/ 를 빼요
$cands = @(
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
  "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe")
$exe = $cands | Where-Object { $_ -and (Test-Path $_) } | Select-Object -First 1
if (-not $exe) { Write-Host '크롬이나 엣지를 찾지 못했어요.'; Read-Host '엔터를 누르면 닫혀요'; exit 1 }
Add-Type -AssemblyName System.Windows.Forms
$wa = [System.Windows.Forms.Screen]::PrimaryScreen.WorkingArea
$w = 640; $h = 240
$x = [int]($wa.Left + ($wa.Width - $w) / 2); $y = [int]($wa.Top + $wa.Height * 0.2)
$dir = [Environment]::GetFolderPath('Programs')
$lnk = Join-Path $dir '해비티카틱 빠른 추가.lnk'
$sh = New-Object -ComObject WScript.Shell
$s = $sh.CreateShortcut($lnk)
$s.TargetPath = $exe
$s.Arguments = "--app=$url --window-size=$w,$h --window-position=$x,$y"
$s.Hotkey = 'CTRL+SHIFT+A'
$s.Description = '해비티카틱 할 일 빠른 추가'
$s.Save()
Write-Host ''
Write-Host '다 됐어요. 이제 어디서든 Ctrl+Shift+A 를 누르면 빠른 추가 창이 떠요.'
Write-Host "브라우저: $exe"
Write-Host "바로 가기: $lnk"
Write-Host ''
Write-Host '안 뜨면: 틱틱의 빠른 추가 단축키(같은 Ctrl+Shift+A)를 끄거나 바꿔 주세요.'
Read-Host '엔터를 누르면 닫혀요'
