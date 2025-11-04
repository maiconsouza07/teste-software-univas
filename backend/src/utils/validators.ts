export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export function isNonEmptyString(value: unknown, min = 1): boolean {
  return typeof value === "string" && value.trim().length >= min;
}

export function isEmail(value: unknown): boolean {
  if (typeof value !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidStatus(s: unknown): s is TaskStatus {
  return ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"].includes(String(s));
}

export function isValidPriority(p: unknown): p is TaskPriority {
  return ["LOW", "MEDIUM", "HIGH", "URGENT"].includes(String(p));
}

/** Normaliza payload de criação de tarefa e valida erros simples */
export function normalizeTaskPayload(input: {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  userId?: number;
  categoryId?: number;
}) {
  if (!isNonEmptyString(input.title, 3)) {
    throw new Error("title must have at least 3 characters");
  }
  const title = input.title!.trim();
  const description = (input.description ?? "").trim();

  const status: TaskStatus = input.status && isValidStatus(input.status)
    ? input.status
    : "PENDING";

  const priority: TaskPriority = input.priority && isValidPriority(input.priority)
    ? input.priority
    : "LOW";

  if (typeof input.userId !== "number" || input.userId <= 0) {
    throw new Error("userId must be a positive number");
  }
  if (typeof input.categoryId !== "number" || input.categoryId <= 0) {
    throw new Error("categoryId must be a positive number");
  }

  return { title, description, status, priority, userId: input.userId, categoryId: input.categoryId };
}
