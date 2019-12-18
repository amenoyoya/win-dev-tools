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
