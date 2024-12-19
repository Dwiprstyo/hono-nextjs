This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) and [Hono.js](https://hono.dev/docs/getting-started/vercel).

## Setup
1. Clone the repository
2. Install dependencies:
```bash
npm i
```

## Prerequisites
- PostgreSQL database

1. Create a `.env` file with:
```
BASE_URL=http://localhost:3000
DATABASE_URL="postgresql://username:password@localhost:5432/socialmedia"
JWT_SECRET="your-secret-key"
```

<!-- 4. Generate Prisma client:
```bash
npm run prisma:generate
```

5. Run database migrations:
```bash
npm run prisma:migrate
``` -->

2. Start the development server:
```bash
npm run dev
```

<!-- ## API Endpoints
- `/auth/register`: User registration
- `/auth/login`: User login
- `/posts`: Create, read posts
- `/users`: User profile management
- `/interactions`: Like, comment, follow functionalities -->

## Technologies
- Next.js
- Hono.js
- Prisma ORM
- PostgreSQL
- Zod Validation
- Bun Runtime