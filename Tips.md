# Windows 10 Tips

## DevCon による USB 制御

USBサブディスプレイなど、スリープから復帰すると上手く動作しなくなるUSB機器を、物理的に抜き差しすることなく再起動できるようにする

### DevCon のインストール
DevCon は [Windows WDK](https://go.microsoft.com/fwlink/?linkid=2085767) に含まれているため、それをインストールする

本リポジトリの [bin](./bin) ディレクトリに `devcon.exe` 単体で入れているため、それを使ってもよい

### USB機器のハードウェアID確認
- `デバイス マネージャ`（Windowsスタートパネルで「device」キーワードから起動可能）
    - (目的のデバイス) > 【詳細】タブ
        - プロパティ: `一致するハードウェアID`
            - => ハードウェアIDを確認する（`USB\XXX\XXX&XXX&XXX`）

### USB機器の再起動スクリプト
ここでは、USBサブディスプレイ（MB168B）を再起動するPowerShellスクリプトを作成する

#### RestartUSB.ps1
```powershell
# Windows WDK の devcon を使う場合
# $devcon = "C:\Program Files (x86)\Windows Kits\10\Tools\x64\devcon.exe"
$devcon = "devcon.exe"

# 再起動対象USBハードウェアID
$usb = "USB\VID_17E9&PID_FF03&MI_00"

if (([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole(`
        [Security.Principal.WindowsBuiltInRole] "Administrator")) {
    # 管理者権限で実行された場合に再起動実行
    Write-Output "管理者として実行しました. devconの実行を試みます. "
    
    # devcon.exe disable コマンドを実行し、完了を待つ
    Start-Process -Wait -FilePath $devcon -ArgumentList "disable $usb"
    
    # devcon.exe enable コマンドを実行し、完了を待つ
    Start-Process -Wait -FilePath $devcon -ArgumentList "enable $usb"
} else {
    # 管理者権限で実行されていない場合は、管理者権限でこのスクリプトを実行
    Write-Warning "管理者として実行していません. 管理者権限で再実行します."
    Start-Process powershell -Verb runas $MyInvocation.MyCommand.Path
}
```

#### 「このシステムではスクリプトの実行が無効になっている」エラーが発生する場合
`.ps1` スクリプトファイルを実行しようとすると上記エラーが発生することがある

これは、PowerShellのポリシーでスクリプトの実行を禁止しているためである

ポリシーを変更するため `Win + X` |> `A` キーで管理者権限PowerShellを起動する

```powershell
# 現在のポリシーを確認
## PowerShellのポリシー
### 実行ポリシー | 署名あり | 署名なし/ローカル | 署名なし/リモート
### Restricted       x              x                  x
### AllSigned        o              x                  x
### RemoteSigned     o              o                  x
### Unrestricted     o              o                 △
### Bypass           o              o                  o
> Get-ExecutionPolicy

# ポリシーを「署名あり or ローカルスクリプトの実行許可」に変更
> Set-ExecutionPolicy RemoteSigned
```
