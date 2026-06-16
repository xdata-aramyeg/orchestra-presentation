# Kickoff Prompt — starting the Orchestra team (live)

Read the spoken intro to the audience, then paste **The Prompt** into the orchestrator
session (or run `/spin-up-orchestra` first, then paste it). Both an English and a
Russian version are provided.

---

## Spoken intro (say this, ~15s)

> "Right now I'm going to hand a single brief to an orchestrator agent. It won't write
> the code itself — it'll split the work across a team, run the independent parts in
> parallel, and stop to check quality before moving on. Let's start them, and then talk
> through what's happening while they work."

## Спикерское вступление (произнести, ~15 сек)

> «Сейчас я передам одно задание агенту-оркестратору. Он не будет писать код сам — он
> разделит работу между командой, запустит независимые части параллельно и будет
> останавливаться для проверки качества, прежде чем двигаться дальше. Давайте запустим
> их, а затем разберём, что происходит, пока они работают.»

---

## The Prompt (English) — paste to the orchestrator

> You are the **Orchestrator** of the Orchestra team. Goal: add a **real waitlist** to
> our Orchestra launch site — a signup form plus a live "builders in line" counter,
> backed by a real database.
>
> **Wave 1 — fan out NOW, in parallel, in the background:**
> - **Researcher:** find 3 strong reference launch pages, finalize the hero/waitlist
>   copy, and write the acceptance criteria.
> - **Designer:** lock the visual direction with **ui-ux-pro-max** and produce the
>   waitlist section design + tokens in **Figma**.
>
> **Then a synchronous checkpoint:** wait for BOTH, verify the brief and the design
> exist, and only then continue.
>
> **Wave 2 — fan out in parallel, in the background:**
> - **Frontend:** build the waitlist form + animated live counter from the design,
>   using **21st.dev magic** components.
> - **Backend:** build `POST /api/waitlist` and `GET /api/waitlist/count` with SQLite
>   and zod validation (dedupe emails, return the signup position).
>
> **Then the quality gate:** when the feature is complete, run **QA** to end-to-end the
> signup flow and the edge cases (invalid email, duplicate, empty). Only when QA
> returns **PASS**, run the **read-only Reviewer** for security and code review.
>
> Announce out loud **every time you fan out (async)** and **every time you wait
> (sync)**. When the Reviewer is clean, tell me it's live.

---

## The Prompt (Русский) — вставить оркестратору

> Ты — **Оркестратор** команды Orchestra. Цель: добавить **реальный лист ожидания**
> (waitlist) на наш лендинг Orchestra — форму регистрации и живой счётчик «строителей в
> очереди», с настоящей базой данных.
>
> **Волна 1 — запусти СЕЙЧАС, параллельно, в фоне:**
> - **Researcher (Исследователь):** найди 3 сильных референса лендингов, финализируй
>   тексты для героя и формы и напиши критерии приёмки.
> - **Designer (Дизайнер):** зафиксируй визуальное направление с помощью **ui-ux-pro-max**
>   и подготовь дизайн секции waitlist и токены в **Figma**.
>
> **Затем синхронная контрольная точка:** дождись ОБОИХ, проверь, что бриф и дизайн
> готовы, и только потом продолжай.
>
> **Волна 2 — запусти параллельно, в фоне:**
> - **Frontend (Фронтенд):** собери форму waitlist и анимированный живой счётчик по
>   дизайну, используя компоненты **21st.dev magic**.
> - **Backend (Бэкенд):** реализуй `POST /api/waitlist` и `GET /api/waitlist/count` с
>   SQLite и валидацией через zod (исключай дубли email, возвращай позицию в очереди).
>
> **Затем контроль качества:** когда фича готова, запусти **QA**, чтобы прогнать
> сценарий регистрации от начала до конца и крайние случаи (неверный email, дубликат,
> пустое поле). Только когда QA вернёт **PASS**, запусти **Reviewer (только чтение)** для
> проверки безопасности и кода.
>
> Объявляй вслух **каждый раз, когда распараллеливаешь работу (async)** и **каждый раз,
> когда ждёшь (sync)**. Когда Reviewer не найдёт проблем — сообщи, что всё готово и
> сайт живой.

---

## Notes for the presenter
- If you want the team assembled first, run `/spin-up-orchestra` before pasting.
- The orchestrator narrates async/sync transitions — that narration IS the demo; pause
  on each one and point at the tmux panes.
- If the live run slips, switch to the **golden backup** (see DEMO-RUNBOOK) — the end
  state is identical, so the story still lands.
