# ChromeExtensions

日本語テキストを英語の `camelCase` に変換する Chrome 拡張です。

## ブラウザで使う手順

1. このリポジトリをローカルに配置する。
2. Chrome で `chrome://extensions/` を開く。
3. 右上の **デベロッパーモード** を ON にする。
4. **パッケージ化されていない拡張機能を読み込む** をクリックし、このフォルダ（`manifest.json` があるフォルダ）を選択する。
5. 拡張アイコン一覧から **JP to English camelCase** を開く。
6. 日本語を入力して **変換** を押す。
7. 生成された camelCase を **結果をコピー** でクリップボードにコピーできる。

## 仕様メモ

- 通常は Google Translate API (`translate.googleapis.com`) にアクセスして英訳し、camelCase に整形します。
- API が失敗した場合は簡易辞書を使ってフォールバック変換します。
