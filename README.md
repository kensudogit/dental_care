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
- **患者管理** — `patients`, `patient(id)`
- **予約・診療台** — `appointments(date)`
- **診療記録** — `treatments(patientId)`
- **Mutation** — `createPatient`, `createAppointment`（GraphiQL / クライアントから利用可）

## 起動

```bash
cd C:\devlop\dental_care
npm install
cd backend && go mod tidy && cd ..
npm run dev
```

- Web: http://localhost:3000  
- GraphQL / GraphiQL: http://localhost:8080/graphql  
- レガシー REST: http://localhost:8080/api/v1/...（互換用）

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

Web イメージはリポジトリルートの **`Dockerfile`** でビルドします（`graphql/` を含めるため Root Directory は空欄）。

## Railway（本番）

**起動コマンドに `docker-compose.yml` は使いません。** API / Web の **2サービス** でデプロイします。

| サービス | Root Directory | Config file |
|----------|----------------|-------------|
| API | `backend` | `/backend/railway.toml` |
| Web | `.`（リポジトリルート） | `/railway.toml` |

Web の必須変数:

```env
API_URL=https://<api-service>.up.railway.app
```

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
