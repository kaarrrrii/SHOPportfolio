import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";

export const runtime = "nodejs";

const MAX_IMAGE_BYTES = 800_000;
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "merch");
const PUBLIC_UPLOAD_DIR = "/uploads/merch";

const MIME_EXTENSIONS: Record<string, string> = {
  "image/avif": "avif",
  "image/gif": "gif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return Response.json({ error: "IMAGE_REQUIRED" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return Response.json({ error: "IMAGE_INVALID_TYPE" }, { status: 400 });
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return Response.json({ error: "IMAGE_TOO_LARGE" }, { status: 413 });
  }

  const extension = MIME_EXTENSIONS[file.type] || getExtensionFromName(file.name) || "webp";
  const filename = `merch-${Date.now().toString(36)}-${randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return Response.json({
    imageSrc: `${PUBLIC_UPLOAD_DIR}/${filename}`,
  });
}

function getExtensionFromName(filename: string) {
  const extension = path.extname(filename).toLowerCase().replace(/^\./, "");

  return /^[a-z0-9]{2,5}$/.test(extension) ? extension : "";
}
