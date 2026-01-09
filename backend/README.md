# Backend — Smart Expense Tracker

This backend uses Express + Prisma (Postgres) and issues JWT tokens for authentication.

## Environment

- Copy `.env.example` -> `.env` and set values before running locally.
- Required variables:
  - `DATABASE_URL` — e.g. `postgresql://user:pass@localhost:5432/dbname?schema=public` (or `file:./dev.db` for SQLite dev)
  - `JWT_SECRET` — a secret string used to sign JWTs

## Quick start (local)

1. Install dependencies

   npm install

2. Create `.env` based on `.env.example` and set `DATABASE_URL` and `JWT_SECRET`.

   - For testing from a physical device, set `HOST=0.0.0.0` to bind to all interfaces, or set `HOST=<your_machine_ip>` (e.g., `192.168.1.10`) so your device can reach it.

3. Generate Prisma client and apply migrations (dev):

   npm run prisma:generate
   npm run prisma:migrate

4. Start dev server:

   npm run dev

Server will run on `http://<HOST>:<PORT>` as configured in `.env` (defaults to `http://0.0.0.0:5000` if you set `HOST=0.0.0.0`).

When started with `HOST=0.0.0.0`, the server prints reachable IP addresses (e.g., `http://192.168.1.10:5000/`) — use one of those IPs from your device browser or set `HOST` to one of them in `.env`.

## Notes

- On Android emulator, if running backend on host machine, use `10.0.2.2` (Android default) in frontend `BASE_URL`.
- For production, use a proper Postgres instance and a strong `JWT_SECRET`.
