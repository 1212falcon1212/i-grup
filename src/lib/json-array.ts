// SQLite'ta PostgreSQL String[] tipi yok. Project.gallery ve Project.techStack
// alanları JSON stringi olarak saklanıyor. Bu helper'lar DB'den okurken parse,
// yazarken stringify yapar.

export function parseArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

export function stringifyArray(value: string[] | null | undefined): string {
  if (!value || value.length === 0) return "[]";
  return JSON.stringify(value);
}
