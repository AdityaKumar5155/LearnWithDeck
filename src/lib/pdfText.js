import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const normalizeSpaces = (text) => String(text || "").replace(/\s+/g, " ").trim();

export const extractPdfText = async (
  file,
  {
    maxChars = 250_000,
    onProgress,
  } = {}
) => {
  if (!(file instanceof File)) throw new Error("PDF file is required");
  if (file.type !== "application/pdf") throw new Error("Only PDF files are supported");

  const buffer = await file.arrayBuffer();
  const doc = await getDocument({ data: buffer }).promise;

  const numPages = doc.numPages || 0;
  if (!numPages) throw new Error("Could not read PDF");

  let out = "";
  for (let pageNumber = 1; pageNumber <= numPages; pageNumber += 1) {
    const page = await doc.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const pageText = (textContent.items || [])
      .map((it) => (typeof it?.str === "string" ? it.str : ""))
      .join(" ");

    const cleaned = normalizeSpaces(pageText);
    if (cleaned) out += (out ? "\n\n" : "") + cleaned;

    if (typeof onProgress === "function") onProgress({ pageNumber, numPages });

    if (out.length >= maxChars) {
      out = out.slice(0, maxChars);
      break;
    }
  }

  const finalText = normalizeSpaces(out);
  if (!finalText) throw new Error("No text found in this PDF (it may be scanned images)");

  return { text: finalText, numPages };
};
