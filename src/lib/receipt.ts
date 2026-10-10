const RECEIPT_KEY =
  /^receipts\/([A-Za-z0-9-]+)\/(\d+)\/([A-Za-z0-9.+_-]+)\/([^/]+)$/;

export type ParsedReceiptKey = {
  registrationId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
};

export function buildReceiptKey(
  id: string,
  file: { name: string; size: number; type: string },
): string {
  const safe =
    file.name.replace(/[^A-Za-z0-9._-]/g, "_").slice(0, 80) || "slip";
  const mime = file.type.replace("/", "_");
  return `receipts/${id}/${file.size}/${mime}/${safe}`;
}

export function parseReceiptKey(raw: unknown): ParsedReceiptKey | null {
  if (typeof raw !== "string") return null;
  const match = RECEIPT_KEY.exec(raw);
  if (!match) return null;
  const fileSize = Number(match[2]);
  if (!Number.isSafeInteger(fileSize) || fileSize < 1) return null;
  return {
    registrationId: match[1] ?? "",
    fileSize,
    fileType: (match[3] ?? "").replace("_", "/"),
    fileName: match[4] ?? "",
  };
}

const sample = buildReceiptKey("abc", {
  name: "slip.jpg",
  size: 1200,
  type: "image/jpeg",
});
const parsed = parseReceiptKey(sample);
if (
  !parsed ||
  parsed.registrationId !== "abc" ||
  parsed.fileSize !== 1200 ||
  parsed.fileType !== "image/jpeg" ||
  parsed.fileName !== "slip.jpg"
) {
  throw new Error("receipt key roundtrip failed");
}
