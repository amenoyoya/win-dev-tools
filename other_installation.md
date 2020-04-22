# その他ツールのインストール

## MySQL on WSL

### Installation
Ubuntu 18.04 on WSL で以下のコマンドを実行

```bash
# mysql-server インストール
$ sudo apt update && sudo apt install -y mysql-server

# mysqlサーバ開始
$ sudo service mysql start

# 初期パスワードの設定
$ sudo mysql_secure_installation

## => 基本的に 'y' (yes) で答えていく
## => パスワードを聞かれたら、設定したいパスワードを入力
```

### Settings
以下の設定をする

- sudo権限なしで mysqlサーバログイン可能にする
- デフォルト文字コードを utf8mb4 にする

Ubuntu 18.04 on WSL で以下のコマンドを実行

```bash
# vimエディタで /etc/mysql/mysql.conf.d/mysqld.cnf を編集
$ sudo vim /etc/mysql/mysql.conf.d/mysqld.cnf
---
# ... (略) ...

# [client]設定項目: なければ作成し default-character-set を設定
[client]
default-character-set=utf8mb4

# [mysqld]設定項目:
## 追加: skip-grant-tables
## 追加: character-set-server: utf8mb4
[mysqld]
skip-grant-tables
character-set-srever=utf8mb4

# ... (略) ...
---

# 編集完了したら mysqlサーバ再起動
$ sudo service mysql restart

# mysqlサーバにログインできるか確認
$ mysql -u root -p
## <= 設定したパスワードを入力

# 問題なくログインできたらOK
> exit
```

***

## Docker on WSL

### Installation
Ubuntu 18.04 on WSL で以下のコマンドを実行

```bash
# Docker (Community Edition) インストール
$ sudo apt install -y apt-transport-https ca-certificates software-properties-common
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
$ echo "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable" | sudo tee -a /etc/apt/sources.list.d/additional-repositories.list
$ sudo apt update && sudo apt install -y docker-ce

# Dockerスタートアップ登録＆起動
$ sudo systemctl enable docker && sudo service docker start

# dockerグループにコンテナ書き込み権限を付与
$ sudo chgrp docker /var/run/docker.sock

# Dockerをsudoなしで実行可能に
$ sudo gpasswd -a $USER docker
$ sudo service docker restart

# DockerCompose導入
$ sudo curl -L https://github.com/docker/compose/releases/download/1.24.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
$ sudo chmod +x /usr/local/bin/docker-compose
```

設定（sudo なしで docker 実行可能にする）を反映するために、一度ターミナルを閉じて再度ログインする

### 動作確認
```bash
# 動作確認用 docker-compose をダウンロード
## Let's Encrypt で SSL 化 + vhost 環境の Apache:2.4 PHP:7.3 コンテナ
$ wget -O - https://github.com/amenoyoya/docker-collection/releases/download/0.2.1/letsencrypt-nginx-proxy.tar.gz | tar zxvf -
$ cd letsencrypt-nginx-proxy/

# Dockerコンテナビルド＆起動
$ export UID && docker-compose build
$ docker-compose up -d
```

vhostを有効化するために、`Win + X` |> `A` キー => 管理者権限PowerShell起動

```powershell
# hostsファイルをメモ帳で編集
> notepad C:\windows\system32\drivers\etc\hosts
### <diff>
# 以下の行を追加: https://web.local/ => 127.0.0.1 (localhost) に関連付け
127.0.0.1    web.local
### </diff>

# vhost設定を反映
> ipconfig /flushdns
```

ここまで実行し https://web.local/ にアクセスする

これで、phpinfo の内容が表示されたらOK

***

## msys2

Windows上で C++ 製の OSSツールを使いたい場合、ソースコードからのビルドが必要になることが多々ある

そういった場合、VisualStudio を使うより、msys2 のような GNU 系コンパイラ環境を使った方が良いことが多い

### Installation
`Win + X` |> `A` => 管理者権限PowerShell起動

```powershell
# chocolatey で msys2 インストール
> choco install -y msys2

## => 64bit環境の場合 C:\tools\msys64\ にインストールされる
## => PATHは自動的に通されるため、PowerShellを開きなおす
```

### pgModeler のビルド
動作確認を兼ねて、OSSのデータモデリングツールである pgModeler をビルドしてみる

```powershell
# msys2/mingw64 起動
> mingw64
```

```bash
# pacman パッケージマネージャで msys2 コアシステム更新
$ pacman -Suy

# ビルドに必要なパッケージをインストール
$ pacman -S git base-devel mingw-w64-x86_64-make mingw-w64-x86_64-gcc mingw-w64-x86_64-postgresql mingw-w64-x86_64-qt5

## => 3GB 近くあるためしばらく待機

# GitHub から pgModeler ソースコード取得
$ git clone https://github.com/pgmodeler/pgmodeler.git
$ cd pgmodeler/

# 開発バージョンを使う場合は develop ブランチに checkout
# $ git checkout develop

# コンパイラ設定を修正
$ sed -i -e 's/C:\/msys64/C:\/tools\/msys64/g' pgmodeler.pri

# pgmodeler インストール先ディレクトリ作成
## ここでは C:\tools\pgmodeler\ にインストールすることを想定
$ INSTALLATION_ROOT=/c/tools/pgmodeler/
$ mkdir -p $INSTALLATION_ROOT

# pgmodeler ビルド＆インストール
$ qmake -r CONFIG+=release PREFIX=$INSTALLATION_ROOT pgmodeler.pro
$ make # CPUスペックにもよるが 1時間近くかかるかもしれない
$ make install
$ cd $INSTALLATION_ROOT
$ windeployqt pgmodeler.exe pgmodeler_ui.dll

# 依存ライブラリをコピー
$ cd $MSYS2_ROOT/mingw64/bin/
$ cp libicuin*.dll libicuuc*.dll libicudt*.dll libpcre2-16-0.dll libharfbuzz-0.dll \
    libpng16-16.dll libfreetype-6.dll libgraphite2.dll libglib-2.0-0.dll libpcre-1.dll \
    libbz2-1.dll libssl-1_1-x64.dll libcrypto-1_1-x64.dll libgcc_s_seh-1.dll \
    libstdc++-6.dll libwinpthread-1.dll zlib1.dll libpq.dll libxml2-2.dll liblzma-5.dll \
    libiconv-2.dll libintl-8.dll libdouble-conversion.dll libzstd.dll $INSTALLATION_ROOT

# 起動
$ cd $INSTALLATION_ROOT
$ ./pgmodeler
```
