# Browser Game

ブラウザで動作するゲーム。GitHub Pages で公開予定。

## ローカルでの動作確認

```bash
# リポジトリのルートで
python3 -m http.server 8000
# → http://localhost:8000 をブラウザで開く
```

## GitHub Pages での公開手順

1. GitHub に同名のリポジトリを作成
2. `git remote add origin git@github.com:<ユーザー名>/<リポジトリ名>.git`
3. `git push -u origin main`
4. GitHub のリポジトリ → Settings → Pages → Source を「Deploy from a branch」、Branch を `main` / `/ (root)` に設定
5. `https://<ユーザー名>.github.io/<リポジトリ名>/` で公開される

## 構成

```
index.html   # エントリーポイント(Pages のルート)
css/         # スタイルシート
js/          # ゲームロジック
assets/      # 画像・音声などの素材
```
