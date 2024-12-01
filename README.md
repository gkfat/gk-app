# A Got Todo App

## local dev

run database
```shell
docker compose --env-file .env -p nestapp up -d
```

seed super account
```shell
pnpm run seed
```