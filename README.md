# 依存関係
- Node v16
- Yarn

# 使い方

`.env.local`を以下のように設定する
``` sh
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGE_SENDER_ID=
REACT_APP_FIREBASE_SENDER_ID=
REACT_APP_FIREBASE_MEASUREMENT_ID=
REACT_APP_STRIPE_PK=
```

``` sh
gsutil cors set cors.json gs://<bucket-name>
```

アカウントをアップグレードする(Blaze)

``` sh
firebase functions:config:set stripe.key="<秘密鍵>"
```

``` sh
cd proto01/functions
firebase functions:config:get > .runtimeconfig.json
```

stripeにて商品を作成しprice idを`functions/src/prices.ts`に書きこむ

``` sh
yarn build
firebase deploy
```

# コンテンツの追加

以下のようなデータをfirestoreの`contents`コレクションに追加する

``` json
{
  "title":"はじめに",
  "details":[
    {
      "link":"/courses/programming/000026829.pdf",
      "title":"プログラミングコース -はじめに-1 "
    },
    {
      "link":"#",
      "title":"プログラミングコース -はじめに-2"
    }
  ],
  "text":"サンプルテキストサンプルテキストサンプルテキストサンプルテキストサンプルテキスト",
  "plans":["FREE","PROGRAMMING"],
  "estimate":-1
}
```

`link`にstorageのパスを指定する(PDF)

`plans`に適用させるプランを書く

`estimate`は推定所用時間

- `/courses/programming/`はプログラミングコース
- `/courses/free/`はだれでも
- `/courses/jobhunting/`は就活コース

`plans`は基本的に1個のみの配列になる(ここでは例外的に2つもたせている)

PDFはあらかじめstorageにアップロードしておく

# Functionsのテスト

``` sh
yarn workspaces run serve
```

# DBのダンプ/リストア

プロジェクトの設定 > サービス アカウント > 新しい秘密鍵の生成
生成して`serviceAccountKey.json`で保存

``` sh
yarn run backup
```

`data.json`を編集し

``` sh
yarn run restore
```
