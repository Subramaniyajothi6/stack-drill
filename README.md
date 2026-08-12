# Stack/Drill

A habit tracker + 20-week learning roadmap for going from JS/MERN to a
freelance-ready full-stack + AI skill set (TypeScript, Next.js, Postgres,
DSA, AWS, Python/FastAPI, RAG, PyTorch).

## The one-hour mode idea

Most habit trackers fail by asking for too much on day one. Stack/Drill
starts everyone in **one-hour mode**: the only thing on today's list is
"1 focused hour on the current phase." No 6-block schedule, no pressure.

Once you hit a **7-day streak**, the full daily block plan (deep build
block, DSA, docs, ship, review, sleep-by cutoff) unlocks as an *option* —
you choose when to switch, it never switches for you. You can always drop
back down to one-hour mode too.

Everything — streaks, XP, levels, badges, and the activity heatmap — is
computed from your real check-ins, starting at zero on day one. Nothing
is pre-seeded or faked.

The roadmap opens with **phase 00, Interview readiness** — job first,
freelance as the six-month aim — followed by the eight-phase freelance
path.

## Features

- **Today** — the day's quest(s), a rule-based coach line, fallback
  options for a bad day, the current roadmap phase, weak spots, and (once
  unlocked) the full block plan. You can add your own quests here too,
  with their own time, length and XP; they show in either mode. Weak
  spots are editable — seeded from real drill scores, not invented ones.
- **Streaks, XP & badges** — a 140-day activity heatmap and badges, all
  derived from your actual history.
- **The roadmap** — the 8 learning phases, each with tasks, a "boss
  fight" milestone, and a mark-cleared toggle.
- **Skills & resources** — every skill in the stack with editable
  resource links: add, edit, or delete your own docs/course/video links.
  Each skill also has a **My notes** section for your own learning notes —
  write your version of a concept once, glance at it later instead of
  relearning it from the docs. Indent a line by two spaces to format it as
  a code block.

## Tech stack

React + TypeScript + Vite. No backend, no accounts — everything is
stored in your browser's `localStorage` through a single storage module
(`app/src/lib/storage.ts`), so your data stays on your device.

## Running it

```bash
cd app
npm install
npm run dev
```

Then open the printed local URL. `npm run build` produces a static
`app/dist/` you can host anywhere (Vercel, Netlify, GitHub Pages,
Cloudflare Pages, ...) since there's no server to run.

## Project layout

```
app/
  src/
    lib/storage.ts       # the only place that touches localStorage
    lib/date.ts           # date-key helpers
    state/useAppState.ts  # all mutations (toggle quest, clear phase, edit links, switch mode)
    state/derived.ts      # streak/XP/level/badges/coach lines/heatmap, computed from history
    data/                 # static content: quests, phases, skills, seed types
    components/           # Sidebar, Header, and one component per screen
```
