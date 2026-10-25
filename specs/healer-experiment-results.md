# テスト修正検証結果

## 検証目的

Playwrightテストの失敗原因をCodexで分析し、修正前後の実行結果を比較する。

## 検証内容

- 対象：顧客検索の正常系テスト
- 意図的な不具合：期待値を `C001` から `C999` に変更
- 失敗原因：テストコードの期待値と仕様書・実際の画面表示が不一致
- 修正方法：Codexで仕様書と失敗記録を比較し、テストコードを修正
- 追加検証：Search Agent・Validator Agentの成功ログを確認

## 実行結果

| 項目       | 修正前          | 修正後          |
| ---------- | --------------- | --------------- |
| 期待値     | C999 - 田中太郎 | C001 - 田中太郎 |
| ログ検証   | なし            | あり            |
| テスト結果 | 1 failed        | 1 passed        |

## 考察

Codexは仕様書と実行結果を参照し、期待値の不一致を特定した。修正後のテストは正常に成功した。

※ 本検証はCodexによる修正実験であり、Playwright Test Healer自体の検証ではない。

## サブエージェントによる修正検証

Codexから独立した汎用サブエージェントを起動し、Playwright Test Healerの設定ファイルに従ってテスト修正を実施した。

- 修正前：1 failed
- 修正内容：期待値を `C999` から `C001` に変更
- 修正後：1 passed
- `test.skip()`・`test.fixme()` は未使用
- テスト実行にはPlaywright CLIを使用

### 制約事項

登録済みHealerエージェントの専用起動機構は使用していない。汎用サブエージェントにHealer設定を適用した検証である。

また、Playwright MCPの `test_run`・`test_debug` は使用できず、CLIで代替した。そのため、MCPを利用したHealerの一連の動作は未検証である。

## Playwright MCP接続・実行検証

プロジェクトの `.codex/config.toml` にPlaywright MCPサーバーを登録し、新しいCodexセッションで `test_run`・`test_debug` が利用可能であることを確認した。

`mcp__playwright_test__test_run` を使用し、`tests/healer-experiment.spec.ts` のみを実行した。

- 実行結果：1 passed
- 全体実行時間：1.6秒
- 使用ツール：Playwright MCP `test_run`
- CLI使用：なし
- ファイル変更：なし

MCP経由のテスト実行は成功した。なお、MCPを利用したHealerの自動修正は未検証である。

## Playwright Test HealerによるMCP修正検証（2026-10-25）

登録済みの `playwright_test_healer` を使用し、`tests/healer-experiment.spec.ts` のTC-01を修正した。仕様根拠は `specs/customer-search.md` のTC-01（入力「田中」、結果「C001 - 田中太郎」、Search Agent・Validator Agentの成功ログ）である。

| 段階 | 使用ツール | 結果 |
| --- | --- | --- |
| 初回実行 | Playwright MCP `test_run` | 1 failed。フロントエンド未起動のため `page.goto` が `ERR_CONNECTION_REFUSED` |
| 初回診断 | Playwright MCP `test_debug` | 接続拒否とエラーページを確認 |
| README記載の3サービス起動後・修正前 | Playwright MCP `test_run` | 1 failed。`C999 - 田中太郎` が見つからず5秒でアサーション失敗（テスト5.8秒） |
| 期待値不一致の診断 | Playwright MCP `test_debug`・`browser_snapshot` | 実画面に `C001 - 田中太郎`、`Search Agent: 1件取得`、`Validator Agent: 成功` を確認 |
| 修正後 | Playwright MCP `test_run` | 1 passed（テスト433ms、全体1.7秒） |

修正はテストの期待値 `C999` を仕様どおり `C001` に戻す1行のみ。既存の両ログ検証は保持した。実際のAPIを使用し、アプリケーションや仕様書は変更していない。`skip`・`fixme` は使用していない。

補助ツールとして `exec_command`（仕様・実装の参照、サービス起動）と `apply_patch`（テスト修正・本記録の追記）を使用した。テスト実行にPlaywright CLIは使用していない。検証範囲は指定ファイルの1件である。
