# Onboarding Bot — 公式サイト

新規メンバーの定着とコミュニティ運営を自動化する多機能Discord Botの紹介サイトです。

- `index.html` — トップページ（機能紹介）
- `commands.html` — コマンド一覧（カテゴリタブ・検索付き）
- `assets/commands.json` — Botのソースコードから自動抽出したコマンドデータ

静的サイトのためビルド不要。GitHub Pagesで配信しています。

ローカル確認: `python3 -m http.server 4173` → http://localhost:4173
