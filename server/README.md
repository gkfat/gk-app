# A Got Todo Server

## local dev

run database
```shell
docker compose --env-file .env -p nestapp up -d
```

seed super account
```shell
cd server

pnpm run seed
```

init client
```shell
cd client

pnpm dev
```