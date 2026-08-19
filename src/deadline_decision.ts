export type DeadlineKind = "maintenance" | "tenant-document" | "inspection";
export type PropertyDeadline = { kind: DeadlineKind; reference: string; dueOn: string };

export function shouldRemind(deadline: PropertyDeadline, today: string, leadDays: number): boolean {
  const due = Date.parse(`${deadline.dueOn}T00:00:00Z`);
  const start = Date.parse(`${today}T00:00:00Z`);
  const days = Math.round((due - start) / 86_400_000);
  return days >= 0 && days <= leadDays;
}
