# 俺がまさお

ブラウザで動作するAI学習クイズゲーム。「サウナ」に見立てた店舗で、偽まさおの発言の真偽をクイズ形式で見抜く。

## 🎮 今すぐ遊ぶ（スマホ対応）

**https://10001000hub.github.io/browser-game/**

スマートフォン・PCのブラウザでそのまま遊べます（インストール不要）。

## ローカルでの動作確認

```bash
# リポジトリのルートで
python3 -m http.server 8000
# → http://localhost:8000 をブラウザで開く
```

## GitHub Pages での公開について

公開済み: main ブランチ / `/ (root)` からの Deploy from a branch 方式。
main へ push すると1〜2分で上記URLに自動反映される。

注意: このリポジトリをプライベートに変更すると、Free プランでは GitHub Pages が
自動停止し公開URLが404になる（公開を維持する間は Public のままにすること）。

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
