import { infrai } from "./src/infrai.ts";
import { shouldRemind, type PropertyDeadline } from "./src/deadline_decision.ts";

const deadlines: PropertyDeadline[] = [
  { kind: "maintenance", reference: "boiler-service-17", dueOn: "2026-08-14" },
  { kind: "tenant-document", reference: "lease-204", dueOn: "2026-08-21" },
  { kind: "inspection", reference: "unit-3b", dueOn: "2026-08-12" },
];
const today = process.env.REMINDER_DATE ?? new Date().toISOString().slice(0, 10);
const leadDays = Number(process.env.REMINDER_LEAD_DAYS ?? "7");
const task = process.env.REMINDER_TASK_URL;
if (!task) throw new Error("REMINDER_TASK_URL is required");
const selected = deadlines.filter((deadline) => shouldRemind(deadline, today, leadDays));
const job = await infrai.cron.create({ cron_expr: "0 8 * * *", task });
try {
  console.log(JSON.stringify({ job_id: job.job_id, today, reminders: selected }));
} finally {
  await infrai.cron.delete(job.job_id);
  try {
    await infrai.cron.get(job.job_id);
    throw new Error(`cron ${job.job_id} still exists after deletion`);
  } catch (error) {
    if (!(error instanceof Error) || !error.message.includes("404")) throw error;
  }
}
