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

## GNU C++ Compiler

Windows上で C++ 製の OSSツールを使いたい場合、ソースコードからのビルドが必要になることが多々ある

そういった場合、VisualStudio を使うより、msys2 のような GNU 系コンパイラ環境を使った方が良いことが多い

### Installation
```bash
# pacman パッケージマネージャで msys2 コアシステム更新
$ pacman -Suy

# ビルドに必要なパッケージをインストール
$ pacman -S base-devel mingw-w64-x86_64-make mingw-w64-x86_64-gcc mingw-w64-x86_64-postgresql mingw-w64-x86_64-qt5

## => 3GB 近くあるためしばらく待機
```

### pgModeler のビルド
動作確認を兼ねて、OSSのデータモデリングツールである pgModeler をビルドしてみる

```bash
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
