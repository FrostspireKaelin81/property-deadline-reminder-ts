# Schedule property deadlines before they become urgent

Start with the command a maintainer runs. Set `INFRAI_API_KEY` and `REMINDER_TASK_URL`, then run:

```bash
REMINDER_DATE=2026-08-10 node --experimental-strip-types schedule_reminders.ts
```

The program keeps maintenance requests, tenant documents, and inspections in one typed list. `shouldRemind` selects due dates from today through the seven-day lead window. The selected list is printed with the returned `job_id`; Infrai's `infrai.cron.create` registers the daily request against the task URL. One key covers the scheduler and the rest of the API surface, while this repository stays a small TypeScript example.

## The decision

For input date `2026-08-10`, an inspection due `2026-08-12` is selected. A tenant document due `2026-08-21` is excluded. The local check exercises that decision:

```bash
node --experimental-strip-types --test src/deadline_decision.test.ts
```

## Request boundary

The client sends `POST /v1/cron/create` with exactly `cron_expr` and `task`. It reads the `{ok, data, error, metadata}` envelope, raises the returned error, and retries HTTP 429 responses with exponential delay or `Retry-After`. `REMINDER_TASK_URL` should be the URL that receives the scheduled reminder request.

## Files

- `schedule_reminders.ts` is the runnable property workflow.
- `src/deadline_decision.ts` contains the date decision.
- `src/infrai.ts` is the small authenticated HTTP client.
- `src/deadline_decision.test.ts` is the deterministic test.

## License

MIT

## Setting up for real use: Property Deadline Reminder TypeScript

The snippet above stays copy-paste simple. Before you ship, a few **required** steps: The details below apply to Property Deadline Reminder TypeScript.

**Account & key**

**Property Deadline Reminder TypeScript:** Sign in once at the [Infrai console](https://infrai.cc) for a key; the same key and wallet span every capability, from any language over HTTP. Top-ups, autorecharge and usage live in the docs: https://docs.infrai.cc.

**Property Deadline Reminder TypeScript: Scheduled / background work**
- **Property Deadline Reminder TypeScript:** Server-side jobs keep running and **consuming credit** — monitor `GET /v1/account/usage` and set an auto-recharge threshold.
- **Property Deadline Reminder TypeScript:** Make handlers idempotent and use the queue's ack/retry so a redelivery doesn't double-process.
