# Got2do App Server

## How to run

require engine

```shell
nodejs >= 20
```

run database & redis

```shell
# for local dev
docker compose --env-file .env.development -p got2do up -d
```

migration

```shell
# start the server will auto run migration
pnpm dev
```

seed 

```shell
# will execute src/database/run-seeder.ts
pnpm run seed
```

start server

```shell
pnpm dev
```