# win-dev-tools

## What's this?

Windowsで開発するときの個人的コマンドラインツール詰め合わせ

***

## Setup

### Environment
- OS: Windows 10 64bit
- Editor: VSCode
- PackageManager: Chocolatey
- CLI:
    - msys2 bash
    - Git for Windows
        - ※ msys2 bash 環境の Git は VSCode との相性が悪いため別途インストールする

### 各種ソフトウェアの導入
`Win + X` |> `A` キー => 管理者権限 PowerShell 起動

```powershell
# Windows用パッケージマネージャとして chocolatey 導入
> Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))

# chocolatey バージョン確認
> choco -v
0.10.15

# VSCode インストール
> choco install -y vscode
## => "C:\Program Files\Microsoft VS Code\" にインストールされる

# Git for Windows インストール
> choco install -y git
## => "C:\Program Files\Git\" にインストールされる

# msys2 インストール
> chovo isntall -y msys2
## => "C:\tools\msys64\" にインストールされる
```

### PATH 設定
- `Win + Pause/Break` > システムの詳細設定 > 環境設定
    - ユーザの環境変数を以下の通り設定
        - `HOME`:
            - `C:\Users\<user>` (`<user>` はユーザ名)
        - `MSYS2_PATH_TYPE`:
            - `inhrerit` (msys2 bash で Windows の PATH 環境変数を引き継ぐ)
        - `PATH`: 以下を追加
            - `C:\tools\msys64\usr\bin`
            - `C:\tools\msys64\mingw64\bin`

### VSCode 設定
- VSCodeプラグインをインストール
    - Japanese Language Pack
    - Markdown Preview Enhanced
- VSCode設定(`Ctrl + ,`)
    - 直接 `settings.json` を開いて [vscode-settings.jsonc](./vscode-settings.jsonc) の内容をコピペする

### Git 設定
VSCode で `Ctrl + Shift + @` キーから bash ターミナルを起動し、Git を導入する

```bash
# ついでに pacman パッケージマネージャで msys2 コアシステムを更新しておく
$ pacman -Suy

# Git 設定
$ git config --global user.name <username> # 好きなユーザ名を設定
$ git config --global user.email <mail@example.dev> # 自分のメールアドレスを設定
$ git config --global core.editor 'code -w' # VSCodeをデフォルトエディターに（-w オプションをつけないとエディタの終了を待ってくれない）
$ git config --global core.autoCRLF false # 改行コードを勝手に修正するのを無効化
$ git config --global core.quotepath false # 日本語ファイル名等をquoteするのを無効化
```

***

## Windows開発環境構築

### Installation
```bash
# このリポジトリをclone
# C:ドライブ直下にダウンロードするのがおすすめ
$ cd /c
$ git clone https://github.com/amenoyoya/win-dev-tools.git
```

以下、`C:`ドライブ直下に`win-dev-tools`ディレクトリがある想定でセットアップを行う

`Win + Pause/Break`キー => システム設定のコントロールパネル起動

- システムの詳細設定 > 環境変数
    - ユーザ環境変数の`PATH`に以下のパスを追加
        - `C:\win-dev-tools\bin`
        - `C:\win-dev-tools\bin\nodejs`
        - `C:\win-dev-tools\bin\php-7.3.8`

### Julia + Python(Anaconda) 環境構築
Julia と PyCall（Python／Anaconda3）とインストールする

`Win + X`キー |> `A`キー => 管理者権限のPowerShell起動

```powershell
# Julia インストール
> choco install -y julia
# => C:\ProgramData\chocolatey\bin\julia.exe にインストールされる

# PyCall パッケージインストール
> julia -e 'using Pkg; Pkg.add("PyCall");'
```

### bash 設定
```bash
# C:\users\<User>\.bashrc に以下の設定を記述
# - Anaconda3アクティベーションスクリプト読み込み: Pythonを使用可能に
# - プロンプトに conda環境と Gitブランチ を表示
## ヒアドキュメント用のアンカー(EOS)を("EOS" or 'EOS' or \EOS)にするとドキュメント内の変数展開をエスケープしてくれる
$ tee ~/.bashrc <<\EOS
function parse_git_branch {
    git branch --no-color 2> /dev/null | grep '^\*' | sed -e 's/^\*\s*//'
}

function display_git_branch {
    local branch=`parse_git_branch`
    if [ "${branch}" != "" ]; then
        echo " (${branch})"
    fi
}

PS1='\[\e[1;32m\]\u@\h \[\e[1;33m\]\w\[\e[1;34m\]`display_git_branch`\[\e[0;37m\]\n\$ '

# Anaconda の activate スクリプトを読み込むと、Anacondaを使用可能になりプロンプトの表示が上書きされる
source ~/.julia/conda/3/Scripts/activate
EOS

# 現在の bash で設定を反映したい場合は ~/.bashrc を読み込む
$ source ~/.bashrc
```

### その他
WSLの導入は [wsl_installation.md](./wsl_installation.md) を参照

その他ツールのインストールは [other_installation.md](./other_installation.md) を参照
