
#  Unicorn Club — University of Wollongong in Dubai (UOWD)

Welcome to **Unicorn Club** — the student-built community platform for the University of Wollongong in Dubai!  
This is a **Next.js 15 + TypeScript** web app scaffold that powers everything from 🧑‍🎓 student listings to 🎉 events, 💬 chat, 👤 profiles, and 🛠️ an admin area — all styled with **Tailwind CSS** and **Radix UI** components.  

> ✨ Built for students, by students. Modern. Scalable. Magical. 

---

## ⚡ Quick Overview

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript + React 19
- **Styling:** Tailwind CSS
- **UI Primitives:** Radix UI, Lucide Icons

---
## 🎥 Demo

👉 Check it out live here:
https://unimate-housing.vercel.app/

## 📚 Table of Contents

- Overview  
- Tech Stack  
- Requirements  
- Getting Started  
- Environment  
- Scripts  
- Project Structure  
- Development Notes  
- Testing & Linting  
- Deployment  
- Contributing  
- Acknowledgements  

---

## Overview

This repository hosts the **frontend for the Unicorn Club** — a student community platform where users can:

- 🏠 Browse & create listings  
- 🎟️ Join & host events  
- 💬 Chat with other members  
- 👤 Manage their profiles  
- 🧑‍💻 Access an admin area  

Built using **Next.js App Router** and **component-driven design** for a clean and modular developer experience.

---

## 🧠 Tech Stack

| Category | Technology |
|-----------|-------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript + React 19 |
| Styling | Tailwind CSS |
| UI Components | Radix UI, Lucide Icons |
| Forms & Validation | react-hook-form + Zod |

---

## ⚙️ Requirements

- 🧩 Node.js 18 or newer  
- 📦 pnpm (recommended) or npm / yarn  

---

## 🚀 Getting Started

1. **Clone** the repository  
2. **Install dependencies** (pnpm recommended):

```bash
pnpm install
```

or with npm:

```bash
npm install
```

3. **Start the development server:**

```bash
pnpm dev
```

Open 👉 [http://localhost:3000](http://localhost:3000)

---

## 🔐 Environment Setup

Create a `.env.local` file in your project root and add the required variables:

```
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-id
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace-with-a-secret
```

💡 Tip: Add a `.env.example` file with placeholders so other devs know what to configure.

You can find integrations and API clients in the `lib/` directory — update credentials accordingly!

---

## 🧾 Scripts

| Command | Description |
|----------|-------------|
| `pnpm dev` | Run development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |

Example workflow:

```bash
pnpm dev
# or
pnpm build && pnpm start
```

---

## 🗂️ Project Structure

```
app/           # Next.js routes & page components
components/    # Feature components & shared UI
components/ui/ # Design-system primitives (buttons, inputs, dialogs)
lib/           # Auth, chat, listings, and server helpers
hooks/         # Reusable React hooks
public/        # Static assets
styles/        # Global Tailwind styles
```

> 🧩 Modular and maintainable — every directory has a clear purpose!

---

## 🧑‍💻 Development Notes

- Using **Next.js App Router** with both server & client components  
- **UI primitives** in `components/ui/` are combined into feature UIs under `components/`  
- **Server-side logic** lives in `lib/` — check out `lib/auth.ts`, `lib/listings.ts`, etc.  
- Tailwind setup lives in `tailwind.config.js` and `postcss.config.mjs`  

---

## 🧪 Testing & Linting

Run ESLint to keep your code fresh and clean ✨:

```bash
pnpm lint
```

> Add tests as needed — integration or unit tests are welcome! 🧬

---

## 🌍 Deployment

Ready to go live? 🚀  

**Deploy to Vercel** in 3 easy steps:

1. Push your branch to GitHub  
2. Connect your repo in [Vercel](https://vercel.com)  
3. Add your environment variables in the Vercel dashboard  

Vercel will handle the rest!  

For self-hosting, just run:

```bash
pnpm build && pnpm start
```

---

## 🤝 Contributing

We ❤️ contributors!

1. Create a new branch from `main`  
2. Make your changes & test locally  
3. Run linting before submitting  
4. Open a pull request 🚀  

If you add new environment variables, please update `.env.example`.

---

## 🙏 Acknowledgements

Built with love and caffeine ☕ using:

- 🪄 Next.js  
- 🎨 Tailwind CSS  
- 🧱 Radix UI  
- 🔮 TypeScript  
- 🦾 Open-source community tools  

See `package.json` for all dependencies.

---

## 📜 License

🛑 No license file yet!  
If this project will be public, please add a `LICENSE` file to define terms of use.

---

> 🦄 “Stay curious, build boldly, and always keep your code magical.” 💫
````
