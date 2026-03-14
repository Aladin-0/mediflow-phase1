# MediFlow

## Stack
- Frontend: Next.js 14 (App Router) + TypeScript + Tailwind
- Backend: Django 5 + DRF + PostgreSQL + Redis
- Infra: Docker Compose

## Stage 1 — Quick Start

### Prerequisites
- Docker Desktop installed and running
- Node.js 20+ (for local dev outside Docker)

### Run with Docker
cp apps/backend/.env.example apps/backend/.env
docker-compose up --build

### Verify everything works:
- Frontend → http://localhost:3000  (shows "Stage 1 complete")
- Backend  → http://localhost:8000/api/v1/health/  (returns {"status":"ok"})
- Postgres → port 5432 (connect with: mediflow / mediflow)
- Redis    → port 6379

## Development (without Docker)
cd apps/frontend && npm install && npm run dev
cd apps/backend && pip install -r requirements.txt
                && python manage.py migrate
                && python manage.py runserver
