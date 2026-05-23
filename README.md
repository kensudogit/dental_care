# DentalCare DX — 歯科医療DXプラットフォーム

**GraphQL 中心**のモダンスタック: Go API + Next.js (React) + GraphQL Code Generator。

## アーキテクチャ

```
graphql/schema.graphql     ← API の Single Source of Truth
        │
        ├─► backend/  Go + graphql-go  →  POST /graphql (+ GraphiQL)
        │
        └─► frontend/ Next.js + GraphQL Codegen → 型付き Query / gqlRequest
```

| レイヤ | 技術 |
|--------|------|
| スキーマ | GraphQL SDL (`graphql/schema.graphql`) |
| API | Go 1.22, chi, graphql-go, GraphiQL |
| Web | Next.js 15, React 19, Typed Document Node |
| 開発 UX | `npm run codegen` で TS 型・Document 自動生成 |

## 機能

- **ダッシュボード** — `dashboard` + `appointments` + `treatments`（1 Query）
- **患者管理** — `patients`, `patient(id)`, `patientProfile`（保険・病歴・アレルギー・問診・来院履歴）
- **予約・診療台** — `appointmentCalendar`, `chairs`, `staffSchedules`、予約の確認・キャンセル・ノーショー・リマインド
- **診療記録** — `treatments(patientId)`
- **Mutation** — `createPatient`, `createAppointment`（GraphiQL / クライアントから利用可）

## 前提

- **Node.js** 20+
- **Go** 1.22+（API 開発用）。未導入の場合:

```powershell
winget install GoLang.Go
```

インストール後、**新しいターミナル**を開くか、そのまま `npm run dev` を実行してください（`dev:api` は Go の標準インストール先も自動で探します）。

## 起動

```bash
cd C:\devlop\dental_care
npm install
cd backend && go mod tidy && cd ..
npm run dev
```

- Web: http://localhost:3000  
- 接続確認: http://localhost:3000/status  
- GraphQL / GraphiQL: http://localhost:8080/graphql  
- レガシー REST: http://localhost:8080/api/v1/...（互換用）

> `frontend` だけで `npm run dev` しても **Go API は起動しません**。必ずリポジトリルートの `npm run dev` を使ってください。

## GraphQL 開発フロー

1. `graphql/schema.graphql` を編集
2. バックエンド `backend/internal/graph/` のリゾルバを更新
3. フロント `frontend/src/graphql/*.graphql` に Operation を追加
4. 型生成:

```bash
cd frontend
npm run codegen
```

5. ページから `gqlRequest(YourDocument)` で呼び出し

## 主要エンドポイント

### GraphQL（推奨）

`POST /graphql`

```graphql
query {
  health { ok service version }
  dashboard { patientsTotal appointmentsToday }
  patients { id name chartNo }
}
```

### REST（レガシー）

| GET | `/api/v1/dashboard` など |

## 環境変数

| 変数 | 既定 | 説明 |
|------|------|------|
| `PORT` | `8080` | Go API |
| `API_URL` | `http://localhost:8080` | Next.js サーバー側 GraphQL URL |

## Docker（ローカル）

```bash
docker compose build
docker compose up
```

Web イメージは **`Dockerfile`**（Root 空欄）または **`frontend/Dockerfile`**（Root `frontend`）でビルドします。Config file と Root Directory の組み合わせは [docs/RAILWAY.md](docs/RAILWAY.md) を参照してください。

## Railway（本番）

**Web で JSON（`dental-care-api`）だけ見える場合** → Web サービスの Root Directory が `backend` になっています。

| 項目 | Web サービス（`dental_care`） |
|------|------------------------------|
| Root Directory | **空欄** |
| Config file | **`/railway.toml`** |
| 再デプロイ後 | トップが **ダッシュボード UI** |

`railway.toml` は **Go + Next.js 一体型**（`Dockerfile.unified`）を使います。**`API_URL` は不要**です（一体型の場合）。

> **ダッシュボードに `fetch failed` / `127.0.0.1:8081` と出る場合**
>
> 1. Railway Variables の **`API_URL` を削除**（一体型では不要）
> 2. **Redeploy**（最新 commit をデプロイ）
> 3. `/status` で次を確認:
>    - `buildId`: `unified-frontend-v3` または `unified-root-v3`
>    - `unifiedDeploy`: `true`
>    - `goBinaryPresent`: `true`
>    - `health.ok`: `true`
> 4. 上記が出ない場合 → **旧ビルドが動いています**。Settings → Build で **Dockerfile** が使われているか確認

### 2サービス構成（Web のみ Next.js、`Dockerfile` 使用時）

Web だけ Next.js イメージ（`Dockerfile`）にする場合は、別 API サービスと `API_URL` が必要です。

**起動コマンドに `docker-compose.yml` は使いません。**

| サービス | Root Directory | Config file |
|----------|----------------|-------------|
| API | `backend` | `/backend/railway.toml` |
| Web（推奨） | 空欄（リポジトリルート） | `/railway.toml` |
| Web（代替） | `frontend` | `/frontend/railway.toml` |

**接続確認**

| URL | 期待される結果 |
|-----|----------------|
| `https://<web>/status` | Next.js JSON、`health.ok: true` |
| `https://<api>/status` | Go API JSON（Web 用ではない） |
| `https://<api>/health` | `{"ok":true,...}` |

Web のトップが `dental-care-api` の JSON なら **Web サービスの Root Directory が誤っています**（[docs/RAILWAY.md](docs/RAILWAY.md) 参照）。

一体型（`Dockerfile.unified`）なら `API_URL` は不要です。2サービスで Web だけ Next.js の場合のみ、Railway Dashboard → **Web サービス** → Variables:

```env
API_URL=https://${{api.RAILWAY_PUBLIC_DOMAIN}}
```

`api` は API サービスの名前に合わせて変更してください（例: サービス名が `backend` なら `${{backend.RAILWAY_PUBLIC_DOMAIN}}`）。

詳細: [docs/RAILWAY.md](docs/RAILWAY.md)

本番向け Compose テンプレート:

```bash
cp .env.railway.example .env.railway
docker compose -f docker-compose.railway.yml --env-file .env.railway up --build
```

## 今後

- gqlgen への移行（Go 側 codegen）
- PostgreSQL + dataloader
- Apollo Client / urql（クライアント Mutation UI）
- サブスクリプション（予約リアルタイム更新）
"# dental_care" 
