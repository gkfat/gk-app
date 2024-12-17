# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Server
  - API documentation
    - Swagger
  - Auth policy
    - Account registered with password must verify email with verificationCode to activate account
    - JWT token validation & Auth guard
    - RBAC guard
  - APIs
    - Auth
    - Accounts
    - Privileges
    - MarketDatas
    - Portfolios
- Client
  - RBAC views control
  - Views
    - Signup / login / Google login
    - Accounts management
    - Portfolios management