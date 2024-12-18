# A GkApp

A app that contains what Gk wants.

## Tech stacks

- Nest.js
- Vue3
- Postgres
- Redis

## Features

- Server
  [x] API documentation
    [x] Swagger
  [x] Auth policy
    [x] Account registered with password must verify email with verificationCode to activate account
    [x] JWT token validation & Auth guard
    [x] RBAC guard
  - APIs
    [x] Auth
    [x] Accounts
    [x] Privileges
    [x] MarketDatas
    [x] Portfolios
- Client
  [x] RBAC views control
  [x] Views
    [x] Auth management
      - [x] Signup
      - [x] login
      - [x] Google login
    [x] Accounts management
    [x] Portfolios management


## Todos

- 因無法解決部署到 Render 上時 static site 的 request proxy 問題，因此 static site 改部署在 cloudflare 上