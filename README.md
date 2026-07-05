# 俺がまさお

ブラウザで動作するAI学習クイズゲーム。「サウナ」に見立てた店舗で、偽まさおの発言の真偽をクイズ形式で見抜く。GitHub Pages で公開予定。

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
index.html          # エントリーポイント(Pages のルート)
css/style.css        # スタイルシート（デザイントークン・画面別スタイル・演出keyframes）
js/main.js            # 状態機械（GameState管理・画面遷移制御）
js/engine/
  quizPicker.js        # シャッフル・10問抽選ロジック（DOM非依存）
  timer.js             # 耐久タイマー（performance.now()ベース、DOM非依存）
js/data/
  stores.js            # 店舗（サウナ）一覧データ
  tempConfig.js        # 温度モード別の持ち時間・ペナルティ設定
  questions-github.js  # 赤坂 GitHub 店の出題プール（30問）
js/screens/            # 画面ごとのUIモジュール（title/storeSelect/tempSelect/intro/quiz/continue/result/review）
assets/               # 画像・音声などの素材（現状未使用）
```
