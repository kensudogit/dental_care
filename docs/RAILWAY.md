# Railway デプロイ手順（DentalCare DX）

このリポジトリは **API（Go）** と **Web（Next.js）** の **2サービス** でデプロイします。

`docker-compose.yml` を起動コマンドに指定する必要は **ありません**。

## 1. リポジトリを接続

1. [Railway](https://railway.com) で New Project → Deploy from GitHub
2. 本リポジトリ `dental_care` を選択

## 1.1 サービスは **2つ** 必要です

| サービス | 役割 | リポジトリ内のパス |
|----------|------|-------------------|
| **api**（名前は任意、下記参照） | Go GraphQL API | `backend/` |
| **dental_care** など | Next.js Web | リポジトリルート |

**Web だけ 1 サービス**だと Go API が動かず `fetch failed` になります。  
キャンバスに API 用のサービスが無い場合は **+ New Service** → 同じ GitHub リポジトリ → Root Directory を `backend` に設定してください。

## 2. API サービス（Go）

| 設定 | 値 |
|------|-----|
| サービス名 | `api`（任意。Web から参照する名前） |
| **Root Directory** | `backend` |
| **Config file path** | `/backend/railway.toml` |
| Builder | Dockerfile（`backend/Dockerfile`） |

**Variables**

| 変数 | 必須 | 説明 |
|------|------|------|
| `PORT` | 自動 | Railway が注入。通常は手動設定不要 |

**Networking**

- Generate Domain を有効化
- 例: `https://dental-care-api-production.up.railway.app`
- 動作確認: `GET /health` → `{"ok":true,...}`

**Watch Paths（推奨）**

```
backend/**
```

## 3. Web サービス（Next.js）

| 設定 | 値 |
|------|-----|
| **Root Directory** | **空欄**（推奨）または `frontend` |
| **Config file path** | 空欄なら `/railway.toml` / `frontend` なら `/frontend/railway.toml` |
| Dockerfile | ルート `Dockerfile` または `frontend/Dockerfile` |

> **Build エラー `"/frontend/package.json": not found`**
> → Root Directory が `frontend` なのに Config file が `/railway.toml`（ルート用）のままです。
> **Config file path を `/frontend/railway.toml` に変更**するか、Root Directory を**空欄**にして `/railway.toml` を使ってください。

> **Build エラー `couldn't locate the dockerfile at path frontend/Dockerfile`**
> → Root Directory が `frontend` で Config file が未設定のときに起きます。**`/frontend/railway.toml`** を指定してください。

**Variables（重要・必須）**

| 変数 | 必須 | 値の例 |
|------|------|--------|
| `API_URL` | **はい** | `https://${{api.RAILWAY_PUBLIC_DOMAIN}}` |

`API_URL` を設定しないと Web は `http://localhost:8080` に接続し、画面上で **Cannot reach API at http://localhost:8080** になります。

Railway Dashboard → **Web サービス**（Next.js / `dental_care`）→ **Variables**:

1. **New Variable** → Name: `API_URL`
2. 値は **Add Reference** から設定（推奨）:
   - 入力欄に **`https://` を先に入力**
   - **Add Reference** → API サービス（例: `api`）→ `RAILWAY_PUBLIC_DOMAIN`
   - 完成形の例: `https://dental-care-api-production-xxxx.up.railway.app`
3. **NG**: `API_URL` が `https://` だけ → `/api/status` で `apiUrlResolved: "https://https:"` になる
4. 手入力: API サービスの **Settings → Networking → Public URL** をコピーしてそのまま貼る

| よくある失敗 | 対処 |
|--------------|------|
| サービスが Web だけ | API サービス（`backend/`）を追加 |
| **`API_URL` を api サービスに付けた** | **Web（`dental_care`）だけ**に付ける。api 側は不要 |
| 値が Web の URL（`dentalcare-production-....`） | **api** の URL（`api-production-....`）にする |
| 変数名が `API URL`（スペース） | 正しくは **`API_URL`**（アンダースコア） |
| `API_URL` が `https://` だけ | ドメインまで含む完全な URL |
| `${{api...}}` のまま動かない | API サービス名が `api` でない → 名前を合わせるか参照を修正 |
| `fetch failed` | API の `/health` を確認 → 直 URL を Web の `API_URL` に貼る |

**あなたの構成の正しい例**

| サービス | Variables |
|----------|-----------|
| **api** | （`API_URL` は不要） |
| **dental_care**（Web） | `API_URL` = `https://api-production-7f8b.up.railway.app` |

設定後 **Web サービスを Redeploy**。

**接続確認**: `https://<web>.up.railway.app/status` → `health.ok: true` なら成功（`/api/status` も可。古いデプロイで 404 のときは `/status` を使う）。

**プライベートネットワークのみ使う場合（任意）**

API サービス名を `api` にし、Web に次を設定する方法もあります（`API_URL` より非推奨）:

```env
API_INTERNAL_HOST=api.railway.internal
API_INTERNAL_PORT=${{api.PORT}}
```

- 末尾に `/` は付けない
- `http://api:8080`（Compose 内のホスト名）は **Railway では使えない**

**Networking**

- Generate Domain を有効化
- ブラウザは Web の URL のみ開く（例: `https://dental-care-web.up.railway.app`）
- `/graphql` は Next.js が `API_URL` へプロキシ

**Watch Paths（推奨）**

```
frontend/**
graphql/**
```

## 4. デプロイ順序

1. **API** を先にデプロイし、公開 URL を確認
2. **Web** に `API_URL` を設定してデプロイ
3. Web の URL をブラウザで開いてダッシュボードを確認

## 5. ローカルで本番相当を試す

```bash
cp .env.railway.example .env.railway
# .env.railway の API_URL を編集

docker compose -f docker-compose.railway.yml --env-file .env.railway up --build
```

- Web: http://localhost:3000  
- API: http://localhost:8080/graphql  

## 6. `Unexpected token 'I', "Internal S"... is not valid JSON`

Web が API に届いていないとき、HTML / プレーンテキストの `Internal Server Error` を JSON と誤って読み込んでこのエラーになります。

| 確認 | 対応 |
|------|------|
| Web の `API_URL` 未設定 | `https://<api>.up.railway.app`（**https**・末尾スラッシュなし） |
| API が未デプロイ / 落ちている | API サービスを先にデプロイし `GET /health` を確認 |
| `API_URL=http://api:8080` | Compose 用。Railway では **公開 HTTPS URL** を使う |

修正後、Web サービスを再デプロイしてください。

## 7. よくある間違い

| 間違い | 正しい対応 |
|--------|------------|
| 起動コマンドに `docker-compose.yml` | 使わない。サービス2つ + 各 Dockerfile |
| Web の Root を `frontend` にしたが Config が `/railway.toml` | **`/frontend/railway.toml`** に変更 |
| `"/frontend/package.json": not found` | 上記の組み合わせミス。Root 空欄 + `/railway.toml` でも可 |
| `API_URL=http://api:8080` on Railway | API の **公開 HTTPS URL** を指定 |
| Config file が効かない | パスは **絶対パス** `/backend/railway.toml` `/railway.toml` |

## 8. ファイル一覧

| ファイル | 用途 |
|----------|------|
| `backend/railway.toml` | API ビルド・ヘルスチェック |
| `railway.toml` | Web ビルド・ヘルスチェック |
| `docker-compose.railway.yml` | 本番向け env 付き Compose テンプレート |
| `.env.railway.example` | 環境変数テンプレート |

開発用の `docker-compose.yml` はローカル専用のままです。

## 9. Docker Compose トラブルシュート

### `all predefined address pools have been fully subnetted`

Docker Desktop で未使用ネットワークが溜まると発生します。

```bash
# 未使用ネットワーク削除
docker network prune -f

# それでもダメなら Docker Desktop を再起動
```

本リポジトリの compose は **固定サブネット**（`172.30.88.0/24` 等）を指定しているため、再発しにくくなっています。

### Compose 内で GraphQL に繋がらない

`.env.railway` に `API_URL=http://localhost:8080` を書くと **Web コンテナ内**から API に届きません。

| 実行環境 | API_URL |
|----------|---------|
| `docker-compose.railway.yml` | 未設定（既定 `http://api:8080`）または `http://api:8080` |
| Railway Web サービス | `https://<api>.up.railway.app` |
