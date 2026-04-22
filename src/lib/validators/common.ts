import { z } from "zod";

export const optionalUrl = z
  .string()
  .trim()
  .url("Geçerli bir URL girin")
  .optional()
  .or(z.literal("").transform(() => undefined));

export const optionalString = z
  .string()
  .optional()
  .or(z.literal("").transform(() => undefined));

export const slugSchema = z
  .string()
  .min(2, "Slug en az 2 karakter olmalı")
  .regex(/^[a-z0-9-]+$/i, "Slug sadece harf, rakam ve tire içerebilir");
