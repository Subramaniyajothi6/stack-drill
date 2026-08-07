import type { Quest, Phase, Skill, WeakSpot, Fallback, Block, Screen } from "./types";

export const ACCENT = "#ec3013";
export const A100 = "#fff2ef";
export const A300 = "#ffc4b8";
export const A500 = "#ff563c";
export const A700 = "#ae1800";

/** Display-only constant — freeze tokens aren't tracked/spent in this build. */
export const FREEZE_TOKENS = 2;

/** Total hours across all 8 curriculum phases — a fact about the plan, not usage data. */
export const HOURS_TOTAL = 600;

export const LEVEL_TITLE = "Full-stack, going independent";

/** Streak length (days) required to unlock the full daily block plan. */
export const FULL_MODE_UNLOCK_STREAK = 7;

export const ONE_HOUR_QUEST: Quest = {
  id: "focus-hour",
  title: "1 focused hour on current phase",
  detail: "Pick the current phase project and go. No tutorials in this block.",
  slot: "",
  short: "1h",
  xp: 100,
};

export const QUESTS_FULL: Quest[] = [
  { id: "build", title: "Deep build block — 2h", detail: "Ship a real feature on the current phase project. No tutorials in this block.", slot: "07:30", short: "2h", xp: 120 },
  { id: "learn", title: "New concept — 1.5h", detail: "Read the docs page for today's topic, then rewrite the example from memory.", slot: "10:00", short: "1.5h", xp: 90 },
  { id: "dsa", title: "DSA — 2 problems", detail: "One pattern per day. Write the brute force, then optimise out loud.", slot: "14:00", short: "45m", xp: 80 },
  { id: "apply", title: "Apply it — 1h", detail: "Use today's concept inside the project, however ugly. Understanding follows use.", slot: "16:00", short: "1h", xp: 70 },
  { id: "ship", title: "Public commit or post", detail: "Push, or post one screenshot with what you learned. This is your freelance proof.", slot: "20:00", short: "15m", xp: 50 },
  { id: "review", title: "10-minute review", detail: "What broke today, what you'll do first tomorrow. Two lines, no more.", slot: "21:30", short: "10m", xp: 30 },
  { id: "sleep", title: "Screens off by 23:30", detail: "The 07:30 build block is only real if this one is.", slot: "23:30", short: "—", xp: 40 },
];

export const PHASES: Phase[] = [
  { n: "01", weeks: "Weeks 1–3", hours: "90h", xp: 900, title: "TypeScript, properly", why: "Almost every paid React/Node contract is TypeScript now. Coming from JS this is your fastest rate increase, so it goes first.", tasks: ["Handbook: narrowing, generics, utility types, discriminated unions", "Convert one existing MERN repo to strict TS, front to back", "Validate every API edge with Zod instead of trusting types"], boss: "Your old project running in strict mode with zero `any`.", proof: "A typed repo you can hand a client to read." },
  { n: "02", weeks: "Weeks 4–6", hours: "90h", xp: 950, title: "Next.js: App Router, server actions, auth", why: "Clients ask for Next by name. Server components change how you think about data fetching, so give it real weeks, not a weekend.", tasks: ["Official Learn course end to end, typed", "Rebuild one React SPA as App Router with server actions", "Auth, protected routes, image + metadata, deploy to Vercel"], boss: "A live, SEO-clean Next app with login and a real database behind it.", proof: "A URL you can put at the top of a proposal." },
  { n: "03", weeks: "Weeks 7–8", hours: "60h", xp: 700, title: "Postgres + Drizzle ORM", why: "You know Mongo. Most agency work is relational. Knowing both, and being able to argue for one, is what a senior freelancer does.", tasks: ["SQL fundamentals: joins, indexes, transactions, EXPLAIN", "Drizzle schema, relations, migrations on Neon or Supabase", "Migrate one Mongoose model set to Postgres and compare queries"], boss: "Same app, both databases, a written note on which you'd bill for and why.", proof: "A short write-up — instant credibility on calls." },
  { n: "04", weeks: "Weeks 9–10", hours: "60h", xp: 700, title: "DSA sprint + portfolio", why: "Your weakest area by your own read. Two focused weeks on patterns beats a year of random problems.", tasks: ["Arrays, two pointers, hashing, sliding window, trees, graphs, DP intro", "Two problems a day, one pattern a day, always explain the trade-off", "Build the portfolio + services page while your best work is fresh"], boss: "50 problems logged with pattern notes, and a portfolio that states your rate.", proof: "The site that actually gets you replies." },
  { n: "05", weeks: "Weeks 11–12", hours: "60h", xp: 750, title: "AWS + shipping like a professional", why: "Deployment is where freelance projects die. Owning the deploy means you can charge for maintenance, not just code.", tasks: ["S3, CloudFront, EC2, RDS, Lambda, IAM basics — build, don't watch", "Dockerise one app; GitHub Actions for test and deploy", "Logs, env secrets, backups, a rollback you have actually run"], boss: "One app deployed on AWS with CI/CD and a rollback you tested on purpose.", proof: "You can now quote hosting and upkeep monthly." },
  { n: "06", weeks: "Weeks 13–15", hours: "90h", xp: 850, title: "Python + FastAPI", why: "Python is the door to everything AI. Learn it as a working backend dev, not from zero — you already know how servers behave.", tasks: ["Python syntax, typing, virtualenvs, pytest — one week, fast", "FastAPI service with Pydantic models and Postgres", "Call it from your Next app; async, background tasks, file uploads"], boss: "A Python service your Next app depends on in production.", proof: "You are now billable in two backend languages." },
  { n: "07", weeks: "Weeks 16–18", hours: "90h", xp: 1000, title: "AI, RAG and the money features", why: "This is the highest-paying thing a small freelancer can offer right now: a chatbot that actually knows a client's documents.", tasks: ["Embeddings, chunking, vector search with pgvector", "RAG pipeline: ingest, retrieve, rerank, cite, evaluate", "Streaming responses, cost and token budgets, prompt versioning"], boss: "\"Chat with your docs\" for a real business — uploads, citations, guardrails.", proof: "The demo you can sell for five figures." },
  { n: "08", weeks: "Weeks 19–20", hours: "60h", xp: 900, title: "PyTorch basics + capstone", why: "Enough PyTorch to read papers and fine-tune small models, then one flagship build that ties the whole stack together.", tasks: ["Tensors, autograd, training loop, fine-tune a small model", "Capstone: Next + TS + FastAPI + Postgres + RAG, deployed on AWS", "Write the case study: problem, decisions, numbers, what you'd charge"], boss: "Capstone live, case study published, three cold proposals sent.", proof: "First paid client conversation." },
];

function links(id: string, raw: [string, string, string][]) {
  return raw.map(([kind, label, url], i) => ({ id: `${id}-${i}`, kind, label, url }));
}

export const SKILLS: Skill[] = [
  { name: "HTML & CSS", level: "Solid", note: "Keep it warm — do layout from scratch occasionally instead of reaching for a component.", links: links("html-css", [["Docs", "MDN CSS layout guide", "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout"], ["Practice", "Flexbox Froggy + Grid Garden", "https://flexboxfroggy.com/"], ["Watch", "Kevin Powell — CSS", "https://www.youtube.com/@KevinPowell"]]) },
  { name: "JavaScript", level: "Solid", note: "Shore up async, closures and the event loop before TypeScript, or TS errors will feel random.", links: links("js", [["Docs", "MDN JavaScript guide", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide"], ["Book", "You Don't Know JS Yet", "https://github.com/getify/You-Dont-Know-JS"], ["Watch", "JS event loop, Jake Archibald", "https://www.youtube.com/watch?v=cCOL7MC4Pl0"]]) },
  { name: "React", level: "Solid", note: "Read the new docs even though you know React — the mental model chapters fix subtle habits.", links: links("react", [["Docs", "react.dev learn", "https://react.dev/learn"], ["Deep dive", "React Query for server state", "https://tanstack.com/query/latest/docs/framework/react/overview"], ["Watch", "Jack Herrington", "https://www.youtube.com/@jherr"]]) },
  { name: "Tailwind", level: "Solid", note: "Learn the config and @apply boundaries so client codebases stay tidy.", links: links("tailwind", [["Docs", "Tailwind docs", "https://tailwindcss.com/docs"], ["Patterns", "Tailwind UI patterns", "https://tailwindcss.com/plus/ui-blocks"], ["Watch", "Tailwind Labs channel", "https://www.youtube.com/@TailwindLabs"]]) },
  { name: "Node + Express", level: "Solid", note: "Next step is error handling, rate limiting and structured logging — the boring things clients pay for.", links: links("node", [["Docs", "Node.js docs", "https://nodejs.org/en/docs"], ["Guide", "Express production best practices", "https://expressjs.com/en/advanced/best-practice-performance.html"], ["Course", "Node.js, freeCodeCamp", "https://www.youtube.com/watch?v=Oe421EPjeBE"]]) },
  { name: "MongoDB + Mongoose", level: "Solid", note: "Add indexes and the aggregation pipeline; that's the difference between a demo and a product.", links: links("mongo", [["Docs", "Mongoose guides", "https://mongoosejs.com/docs/guide.html"], ["Course", "MongoDB University free courses", "https://learn.mongodb.com/"], ["Reference", "Aggregation pipeline", "https://www.mongodb.com/docs/manual/aggregation/"]]) },
  { name: "TypeScript", level: "Next up", note: "Phase 01. Do not read all of it — learn 20% and convert a real repo.", links: links("ts", [["Docs", "TS Handbook", "https://www.typescriptlang.org/docs/handbook/intro.html"], ["Course", "Total TypeScript free tutorials", "https://www.totaltypescript.com/tutorials"], ["Watch", "Matt Pocock", "https://www.youtube.com/@mattpocockuk"]]) },
  { name: "Next.js", level: "Next up", note: "Phase 02. The official course is genuinely the best resource; do it typed.", links: links("next", [["Docs", "Next.js Learn", "https://nextjs.org/learn"], ["Reference", "App Router docs", "https://nextjs.org/docs/app"], ["Watch", "Vercel channel", "https://www.youtube.com/@VercelHQ"]]) },
  { name: "Postgres + Drizzle", level: "Next up", note: "Phase 03. Free tier on Neon, no local setup pain.", links: links("pg", [["Docs", "Drizzle ORM docs", "https://orm.drizzle.team/docs/overview"], ["Practice", "PostgreSQL Exercises", "https://pgexercises.com/"], ["Course", "SQL, Mode analytics tutorial", "https://mode.com/sql-tutorial/"]]) },
  { name: "DSA", level: "Weak spot", note: "Phase 04. Patterns, not problem count. Log every one with the pattern name.", links: links("dsa", [["Course", "NeetCode roadmap", "https://neetcode.io/roadmap"], ["Practice", "LeetCode top interview 150", "https://leetcode.com/studyplan/top-interview-150/"], ["Book", "Open Data Structures, free", "https://opendatastructures.org/"]]) },
  { name: "AWS + DevOps", level: "Weak spot", note: "Phase 05. Set a billing alarm on day one, then build small things for real.", links: links("aws", [["Docs", "AWS Skill Builder free tier", "https://skillbuilder.aws/"], ["Course", "AWS Cloud Practitioner, freeCodeCamp", "https://www.youtube.com/watch?v=SOTamWNgDKc"], ["Guide", "Docker getting started", "https://docs.docker.com/get-started/"]]) },
  { name: "Python", level: "New", note: "Phase 06. One week of syntax, then straight into FastAPI — you already know backends.", links: links("python", [["Docs", "Python tutorial", "https://docs.python.org/3/tutorial/"], ["Docs", "FastAPI tutorial", "https://fastapi.tiangolo.com/tutorial/"], ["Course", "Real Python basics path", "https://realpython.com/learning-paths/python-basics/"]]) },
  { name: "AI, ML & RAG", level: "New", note: "Phase 07. Ship a RAG app before touching theory; the theory sticks better afterwards.", links: links("ai", [["Course", "Hugging Face LLM course", "https://huggingface.co/learn/llm-course"], ["Docs", "LangChain RAG tutorial", "https://python.langchain.com/docs/tutorials/rag/"], ["Watch", "Andrej Karpathy — LLM intro", "https://www.youtube.com/watch?v=zjkBMFhNj_g"]]) },
  { name: "PyTorch", level: "New", note: "Phase 08. Enough to fine-tune and to read a paper without panic.", links: links("pytorch", [["Docs", "PyTorch tutorials", "https://pytorch.org/tutorials/"], ["Course", "fast.ai practical deep learning", "https://course.fast.ai/"], ["Watch", "Karpathy — building makemore", "https://www.youtube.com/watch?v=PaCmpygFfXo"]]) },
];

export const WEAK: WeakSpot[] = [
  { name: "DSA", pct: 24, note: "12 of 50 problems" },
  { name: "AWS / deployment", pct: 15, note: "Phase 05, not started" },
  { name: "TypeScript generics", pct: 45, note: "Shaky under pressure" },
  { name: "Writing tests", pct: 20, note: "Skipped 4 weeks running" },
];

export const FALLBACKS: Fallback[] = [
  { title: "The 15-minute rule", body: "Can't do the full block? Do 15 minutes on the same task. It counts, the streak lives, momentum survives." },
  { title: "Swap, don't skip", body: "Bad energy day? Trade the build block for a DSA problem or a docs read. Any quest keeps the day green." },
  { title: "Freeze token", body: "Two per month. Travel, illness, family — spend one guilt-free instead of breaking a streak." },
  { title: "Sunday catch-up", body: "Sunday is deliberately empty. Missed hours land there, capped at 3 — never repay a whole week." },
];

export const BLOCKS: Block[] = [
  { time: "07:30–09:30", what: "Deep build block — current phase project" },
  { time: "10:00–11:30", what: "New concept: docs, then rebuild from memory" },
  { time: "14:00–14:45", what: "DSA — two problems, one pattern" },
  { time: "16:00–17:00", what: "Apply today's concept in the project" },
  { time: "20:00–20:15", what: "Commit, push, post one screenshot" },
  { time: "21:30–21:40", what: "Two-line review, set tomorrow's first task" },
];

export const SCREEN_TITLES: Record<Screen, string> = {
  today: "Today",
  streaks: "Streaks, XP & badges",
  roadmap: "The roadmap",
  skills: "Skills & resources",
};

export const SCREEN_TAGLINES: Record<Screen, string> = {
  today: "",
  streaks: "Consistency beats intensity",
  roadmap: "JS/MERN → freelance-ready in 20 weeks",
  skills: "Your stack, honestly assessed",
};

export const SCREEN_ORDER: Screen[] = ["today", "streaks", "roadmap", "skills"];
