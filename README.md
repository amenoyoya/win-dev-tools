# win-dev-tools

## What's this?

Windowsで開発するときの個人的コマンドラインツール詰め合わせ

***

## Setup

### Environment
- OS: Windows 10 Pro x64
- Editor: VSCode
    - https://code.visualstudio.com/
- CLI: Git bash (Git for Windows)
    - https://gitforwindows.org/

### Preparation
- VSCode と Git for Windows をインストール
    - エクスプローラ拡張も有効化しておくと便利
- VSCodeプラグインをインストール
    - Japanese Language Pack
    - Markdown Preview Enhanced
- VSCode設定(`Ctrl + ,`)
    - ※ 直接`settings.json`を開いて [vscode-settings.jsonc](./vscode-settings.jsonc)の内容をコピペしてもOK
    - `files.eol`:
        - 改行設定 => `\n` (Unix系ツールは`\r`が入っていると動作がおかしくなるものが多いため)
    - `terminal.integrated.shell.windows`:
        - 内部ターミナル => `C:\\Program Files\\Git\\bin\\bash.exe` (Git for Windows のインストール先ディレクトリ)
- Git bash 起動時にホームディレクトリの `.bashrc` を読み込むように設定
    - **C:\Program Files\Git\etc\bash.bashrc**
        ```diff
        # System-wide bashrc file
        + if [ -f ~/.bashrc ]; then
        +     . ~/.bashrc
        + fi
        ```

### Installation
```bash
# このリポジトリをclone
# C:ドライブ直下にダウンロードするのがおすすめ
$ cd /c
$ git clone https://github.com/amenoyoya/win-dev-tools.git
```

- 以下、`C:`ドライブ直下に`win-dev-tools`ディレクトリがある想定でセットアップを行う
- `Win + Pause/Break`キーを押して システム設定のコントロールパネル起動
    - システムの詳細設定 > 環境変数
        - システム環境変数の`PATH`に以下のパスを追加
            1. `C:\win-dev-tools\bin`
            2. `C:\win-dev-tools\bin\nodejs`
            3. `C:\win-dev-tools\bin\php-7.3.8`

### Miniconda3
- Python環境としてMiniconda3をインストールする
- 管理者権限のPowerShellで以下を実行
    ```powershell
    # Windows用パッケージマネージャとして chocolatey 導入
    > Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))

    # chocolatey バージョン確認
    > choco -v
    0.10.15

    # miniconda3 インストール
    > choco install -y miniconda3
    # -> C:\tools\miniconda3 にインストールされる
    ```
- bash起動時に Pythonへのパスを通すように設定
    - **C:/Users/ユーザー名/.bashrc**
        ```bash
        source /c/tools/miniconda3/Scripts/activate
        ```
