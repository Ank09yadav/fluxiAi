# FluxiAi

FluxiAi is an AI-powered developer platform that helps build, run, and preview Next.js web applications inside secure sandbox environments.

It solves the real-world problem of safely turning AI-generated application ideas into runnable projects by combining intelligent code orchestration, containerized execution, and instant feedback.

---

## 🚀 What FluxiAi Does

FluxiAi enables developers and AI agents to:
- generate and modify Next.js applications automatically
- execute them inside isolated E2B sandboxes
- preview changes instantly through the Next.js development server
- persist application state using Prisma + PostgreSQL
- manage users securely with Clerk
- orchestrate workflows with Inngest

This reduces manual setup overhead, prevents unsafe host changes, and accelerates AI-based prototyping.

---

## ✨ Key Features

- **Autonomous AI development**: AI can write, update, and validate application code.
- **Secure sandbox runtime**: Uses E2B to run generated Next.js apps in isolated environments.
- **Live app preview**: Next.js dev server provides immediate rendering and hot reload.
- **Persistent backend**: Prisma with PostgreSQL stores application and user state.
- **Authentication support**: Clerk integration enables secure user access.
- **Workflow orchestration**: Inngest manages background jobs and agent workflows.

---

## 🧩 Problem Solved

Many AI development platforms struggle with safe execution and real-world usability. FluxiAi addresses this by:

1. Eliminating the need to manually configure and maintain development environments.
2. Running generated apps in sandbox containers so code execution is contained and secure.
3. Providing a connected stack for app generation, preview, data storage, auth, and workflow management.

This makes it easier to prototype AI-generated Next.js applications while keeping developer workflows stable and reproducible.

---

## 🛠️ Tech Stack

- **Next.js 16** with App Router
- **React 19**
- **Tailwind CSS 4**
- **Shadcn UI**
- **Prisma + PostgreSQL**
- **Clerk** for authentication
- **Inngest** for orchestration
- **E2B** for sandboxed runtime environments
- **OpenAI GPT-4o-mini** for AI capabilities

---

## 📁 Project Structure

- `app/` – Next.js application routes and UI pages
- `public/` – Static assets and frontend resources
- `prisma/` – Database schema and Prisma configuration
- `sandbox-templates/` – E2B sandbox templates for runtime environments
- `docker-compose.yml` – Local PostgreSQL service definition
- `next.config.mjs` – Next.js configuration
- `package.json` – Scripts and dependency declarations

---

## ⚙️ Getting Started

### Prerequisites

- Node.js 20+
- Docker Desktop
- E2B CLI (`npm install -g e2b`)

### Setup

1. Clone the repository:

```bash
git clone https://github.com/Ank09yadav/fluxiAi.git
cd fluxiAi
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fluxiai?schema=public"
OPENAI_API_KEY=your_openai_api_key
E2B_API_KEY=your_e2b_api_key
```

4. Start PostgreSQL with Docker:

```bash
docker compose up -d
```

5. Apply the Prisma schema:

```bash
npx prisma db push
```

6. Build the E2B sandbox template:

```bash
cd sandbox-templates/next-js
e2b login
e2b template build
```

---

## ▶️ Run Locally

Start the Next.js server:

```bash
npm run dev
```

Run the Inngest worker locally if you need agent orchestration:

```bash
npm run inngest
```

Open `http://localhost:3000` in your browser.

---

## 📌 Notes

- The project uses containerized sandboxes for secure execution of generated applications.
- `docker-compose.yml` starts a local PostgreSQL database named `fluxiai`.
- `sandbox-templates/next-js` contains the E2B template used to launch sandboxed runtime environments.

---

## 🙋‍♂️ Contact

- Email: ankur.appdev@gmail.com
- GitHub: [@Ank09yadav](https://github.com/Ank09yadav)

---

Built to accelerate AI-assisted application development with secure sandboxing and end-to-end runtime support.