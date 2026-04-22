import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createId } from "@paralleldrive/cuid2";
import sharp from "sharp";
import { prisma } from "@/lib/db";

const ALLOWED_IMAGE_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

export const MAX_UPLOAD_BYTES =
  Number(process.env.MAX_UPLOAD_SIZE_MB ?? "5") * 1024 * 1024;

const publicDir = path.join(process.cwd(), "public");
const uploadsDir = path.join(publicDir, "uploads");

function safeId() {
  try {
    return createId();
  } catch {
    // Fallback random id if cuid2 unavailable
    return (
      Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
    );
  }
}

export async function saveImage(file: File) {
  if (!ALLOWED_IMAGE_MIME.has(file.type)) {
    throw new Error("Desteklenmeyen görsel tipi");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(
      `Dosya boyutu ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)}MB'ı aşıyor`
    );
  }

  const now = new Date();
  const yyyy = now.getFullYear().toString();
  const mm = (now.getMonth() + 1).toString().padStart(2, "0");
  const subdir = path.join(yyyy, mm);
  const targetDir = path.join(uploadsDir, subdir);
  await mkdir(targetDir, { recursive: true });

  const id = safeId();
  const filename = `${id}.webp`;
  const absolutePath = path.join(targetDir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  const processed = await sharp(buffer, { failOn: "none" })
    .rotate()
    .resize({ width: 1920, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer({ resolveWithObject: true });

  await writeFile(absolutePath, processed.data);

  const relativePath = `/uploads/${subdir}/${filename}`;

  const media = await prisma.media.create({
    data: {
      filename,
      path: relativePath,
      mimeType: "image/webp",
      size: processed.data.byteLength,
      width: processed.info.width,
      height: processed.info.height,
      alt: null,
    },
  });

  return media;
}

export async function saveRawFile(file: File, subfolder: string) {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(
      `Dosya boyutu ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)}MB'ı aşıyor`
    );
  }
  const now = new Date();
  const yyyy = now.getFullYear().toString();
  const mm = (now.getMonth() + 1).toString().padStart(2, "0");
  const subdir = path.join(subfolder, yyyy, mm);
  const targetDir = path.join(uploadsDir, subdir);
  await mkdir(targetDir, { recursive: true });

  const id = safeId();
  const ext = path.extname(file.name) || ".bin";
  const filename = `${id}${ext}`;
  const absolutePath = path.join(targetDir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(absolutePath, buffer);

  return {
    filename,
    relativePath: `/uploads/${subdir}/${filename}`,
    size: buffer.byteLength,
  };
}
