# StudyBookClient
StudyBookのクライアントアプリです。

# 動作確認環境
mac OS Big Sur
Windows 10

## 開発用ツール
- yarn 1.22.10

# 開発環境構築
- yarnのインストールをしておく。
  - Windowsであればインストーラー
  - Macであれば、brewなど。

以下bashコマンド
- リポジトリダウンロード
```bash
git clone git@github.com:BMuscle/StudyBookClient.git
cd StudyBookClient
```

# 動作（開発モードでの起動）
以下bashコマンド
```bash
cd my_app
yarn install
yarn electron:serve
```

# ファイル同期について
本番環境へ行う場合はそのまま。
開発環境（自分のPC）などで行う場合は、`my_app/src/components/api.js`の、先頭のbaseURLをWebアプリへ変更する。
