# お問い合わせフォーム設定ガイド

## Web3Forms を使用する方法（推奨・無料）

### ステップ1: アクセスキーの取得
1. https://web3forms.com にアクセス
2. メールアドレス `info@raiose.com` を入力
3. 「Get Access Key」をクリック
4. メールで届くアクセスキーをコピー

### ステップ2: アクセスキーの設定
1. `/raiose-website/pages/contact.html` を開く
2. `YOUR_ACCESS_KEY_HERE` を実際のアクセスキーに置き換える

```html
<input type="hidden" name="access_key" value="ここにアクセスキーを入力">
```

### ステップ3: 動作確認
1. フォームに入力して送信
2. info@raiose.com にメールが届くことを確認

## Formspree を使用する方法（代替案）

### ステップ1: Formspreeアカウント作成
1. https://formspree.io にアクセス
2. サインアップ（無料プランでOK）
3. 新しいフォームを作成

### ステップ2: フォームの設定
1. フォームIDをコピー（例: `xjkqgdny`）
2. contact.html のフォームアクションを更新：

```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

## その他のオプション

### EmailJS（JavaScript経由）
- https://www.emailjs.com
- JavaScriptのみで動作
- APIキーの設定が必要

### Vercel Functions（サーバーレス）
- Vercel環境で動作
- より高度なカスタマイズが可能
- プログラミング知識が必要

## セキュリティ注意事項
- アクセスキーは公開リポジトリにコミットしない
- 環境変数を使用することを推奨
- スパム対策（reCAPTCHA等）の導入を検討

## トラブルシューティング

### メールが届かない場合
1. スパムフォルダを確認
2. アクセスキーが正しいか確認
3. フォームのname属性が正しいか確認

### エラーが表示される場合
1. ブラウザのコンソールでエラーを確認
2. ネットワークタブでリクエストを確認
3. CORSエラーの場合は、フォームのaction URLを確認