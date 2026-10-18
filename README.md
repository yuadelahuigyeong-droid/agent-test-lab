# Agent Test Lab

React、Express、Playwrightを使用した、顧客検索・データ検証・E2Eテストの学習用プロジェクトです。

検索処理と検証処理を分離し、HTTP通信によるサービス間連携と、正常系・異常系の自動テストを実装しています。

## 1. プロジェクトの目的

- ReactとExpressによるWebアプリケーションの構築
- 検索処理と検証処理の責務分離
- HTTP通信によるサービス間連携の実装
- エラー発生時の処理と実行ログの可視化
- PlaywrightによるE2Eテストの自動化

## 2. システム構成

```text
React (Port 5173)
    |
    v
Express API (Port 3001)
    |
    +-- Search Agent
    |      顧客データの検索
    |
    +-- HTTP POST
           |
           v
       Validator Server (Port 3002)
           |
           +-- Validator Agent
                  顧客データの検証
```

※ 現時点のSearch AgentとValidator Agentは、ルールベースの処理モジュールです。LLMによる自律的な判断や、公式A2Aプロトコルは実装していません。

## 3. 主な機能

### 顧客検索

顧客名を入力し、該当する顧客データを検索します。

### データ検証

検索結果をValidator ServerへHTTP POSTで送信し、顧客データの形式を検証します。

### 実行ログ表示

検索処理・検証処理の実行状況をReact画面に表示します。

### エラーハンドリング

Validator Serverとの通信に失敗した場合、HTTP 502を返し、画面にエラーメッセージと実行ログを表示します。

## 4. 使用技術

| 分類           | 技術                    |
| -------------- | ----------------------- |
| フロントエンド | React、TypeScript、Vite |
| バックエンド   | Node.js、Express        |
| サービス間通信 | HTTP、JSON              |
| E2Eテスト      | Playwright、Chromium    |
| バージョン管理 | Git                     |

## 5. 起動方法

Node.jsとnpmがインストールされている環境で実行します。

### 依存パッケージのインストール

```bash
npm install
```

### Validator Serverの起動

```bash
node server/validatorServer.js
```

### Express APIの起動

別のターミナルで実行します。

```bash
node server/index.js
```

### Reactの起動

さらに別のターミナルで実行します。

```bash
npm run dev
```

ブラウザで http://localhost:5173/ にアクセスします。

## 6. テスト方法

Playwright用Chromiumをインストールします。

```bash
npx playwright install chromium
```

テストを実行します。

```bash
npx playwright test
```

### テストケース

| テスト | 内容                                          |
| ------ | --------------------------------------------- |
| 正常系 | 顧客検索結果と検証成功ログを確認              |
| 異常系 | APIモックでHTTP 502を再現し、エラー表示を確認 |

異常系の自動テストでは、Playwrightの`page.route()`を使用してAPIレスポンスをモックしています。

また、手動テストではValidator Serverの停止・復旧による動作確認も実施しました。

## 7. 今後の改善予定

- テストケースの追加
- 実行ログ表示の改善
- サービス間通信の設定管理
- LLMを活用したエージェント機能の検討

## 8. 補足

本プロジェクトは、サービス間連携とテスト自動化の学習・技術検証を目的としたデモアプリケーションです。
