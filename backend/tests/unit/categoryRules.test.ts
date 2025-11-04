import {
  isNonEmptyString,
  isEmail,
  isValidStatus,
  isValidPriority,
  normalizeTaskPayload
} from "../../src/utils/validators";

import { describe, test, expect } from "vitest";

describe("Validações básicas", () => {
  test("isNonEmptyString", () => {
    expect(isNonEmptyString("abc", 3)).toBe(true);
    expect(isNonEmptyString("ab", 3)).toBe(false);
    expect(isNonEmptyString("   ", 1)).toBe(false);
  });

  test("isEmail", () => {
    expect(isEmail("ana@exemplo.com")).toBe(true);
    expect(isEmail("inválido")).toBe(false);
  });

  test("status e prioridade válidos", () => {
    expect(isValidStatus("PENDING")).toBe(true);
    expect(isValidStatus("EM_ANDAMENTO")).toBe(false);
    expect(isValidPriority("HIGH")).toBe(true);
    expect(isValidPriority("ALTA")).toBe(false);
  });
});

describe("Transformação e erros simples (normalizeTaskPayload)", () => {
  test("aplica defaults e normaliza campos", () => {
    const out = normalizeTaskPayload({
      title: "  Estudar testes  ",
      description: "  cap. 1 ",
      userId: 1,
      categoryId: 2
    });

    expect(out).toEqual({
      title: "Estudar testes",
      description: "cap. 1",
      status: "PENDING",
      priority: "LOW",
      userId: 1,
      categoryId: 2
    });
  });

  test("respeita status/priority válidos", () => {
    const out = normalizeTaskPayload({
      title: "Tarefa",
      userId: 1,
      categoryId: 1,
      status: "IN_PROGRESS",
      priority: "HIGH"
    });
    expect(out.status).toBe("IN_PROGRESS");
    expect(out.priority).toBe("HIGH");
  });

  test("erro: título curto", () => {
    expect(() =>
      normalizeTaskPayload({ title: "ok", userId: 1, categoryId: 1 })
    ).toThrow("title must have at least 3 characters");
  });

  test("erro: userId inválido", () => {
    expect(() =>
      normalizeTaskPayload({ title: "Boa", userId: 0, categoryId: 1 })
    ).toThrow("userId must be a positive number");
  });

  test("erro: categoryId inválido", () => {
    expect(() =>
      normalizeTaskPayload({ title: "Boa", userId: 1, categoryId: -5 })
    ).toThrow("categoryId must be a positive number");
  });
});
