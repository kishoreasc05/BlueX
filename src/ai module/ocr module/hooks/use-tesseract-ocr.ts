import { useState, useCallback, useRef } from "react";
import { createWorker, Worker } from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist";
import { OcrProgressState, OcrResult } from "../types/ocr.types";

// Configure pdfjs worker source safely for browser usage
if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

interface UseTesseractOcrOptions {
  language?: string; // default "eng"
  confidenceThreshold?: number; // default 70
}

export function useTesseractOcr(options: UseTesseractOcrOptions = {}) {
  const defaultLang = options.language || "eng";
  const [progressState, setProgressState] = useState<OcrProgressState>({
    stage: "idle",
    progressPercentage: 0,
    statusMessage: "Ready for document processing",
  });

  const workerRef = useRef<Worker | null>(null);

  const processImageOrPdf = useCallback(
    async (file: File): Promise<OcrResult> => {
      const startTime = performance.now();
      setProgressState({
        stage: "initializing",
        progressPercentage: 5,
        statusMessage: "Initializing Tesseract OCR worker engine...",
      });

      try {
        // Initialize Tesseract worker lazy
        const worker = await createWorker(defaultLang, 1, {
          logger: (m) => {
            if (m.status === "recognizing text") {
              const pct = Math.min(90, Math.round(15 + m.progress * 75));
              const remainingSec = m.progress > 0 ? Math.round((1 - m.progress) * 8) : 5;
              setProgressState((prev) => ({
                ...prev,
                stage: "recognizing_text",
                progressPercentage: pct,
                statusMessage: `Extracting text: ${Math.round(m.progress * 100)}%`,
                estimatedTimeRemainingSec: remainingSec,
              }));
            }
          },
        });
        workerRef.current = worker;

        let extractedText = "";
        let totalConfidence = 0;
        let pageCount = 1;

        if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
          setProgressState({
            stage: "rendering_pdf",
            progressPercentage: 15,
            statusMessage: "Rendering PDF pages for OCR extraction...",
          });

          const arrayBuffer = await file.arrayBuffer();
          const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          pageCount = pdfDoc.numPages;

          const textParts: string[] = [];
          let confidenceSum = 0;

          for (let p = 1; p <= pageCount; p++) {
            setProgressState({
              stage: "rendering_pdf",
              progressPercentage: Math.round(15 + (p / pageCount) * 20),
              statusMessage: `Processing PDF page ${p} of ${pageCount}...`,
              currentPage: p,
              totalPages: pageCount,
            });

            const page = await pdfDoc.getPage(p);
            const viewport = page.getViewport({ scale: 2.0 }); // higher resolution for better OCR
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            if (context) {
              await page.render({ canvasContext: context, viewport, canvas } as any).promise;
              const imageDataUrl = canvas.toDataURL("image/png");

              const res = await worker.recognize(imageDataUrl);
              textParts.push(`--- Page ${p} ---\n${res.data.text}`);
              confidenceSum += res.data.confidence || 0;
            }
          }

          extractedText = textParts.join("\n\n");
          totalConfidence = pageCount > 0 ? Math.round(confidenceSum / pageCount) : 0;
        } else {
          // Direct Image OCR (JPG, PNG, WEBP)
          setProgressState({
            stage: "recognizing_text",
            progressPercentage: 20,
            statusMessage: "Extracting optical characters from image...",
          });

          const imageUrl = URL.createObjectURL(file);
          const res = await worker.recognize(imageUrl);
          URL.revokeObjectURL(imageUrl);

          extractedText = res.data.text;
          totalConfidence = Math.round(res.data.confidence || 0);
        }

        const endTime = performance.now();
        const durationMs = Math.round(endTime - startTime);

        await worker.terminate();
        workerRef.current = null;

        const isAutoApproved = totalConfidence >= (options.confidenceThreshold || 70);

        setProgressState({
          stage: "completed",
          progressPercentage: 100,
          statusMessage: "OCR extraction completed successfully",
        });

        return {
          text: extractedText,
          confidence: totalConfidence,
          processingTimeMs: durationMs,
          language: defaultLang,
          autoApproved: isAutoApproved,
          pageCount,
        };
      } catch (err: any) {
        if (workerRef.current) {
          try {
            await workerRef.current.terminate();
          } catch {}
          workerRef.current = null;
        }

        const errorMessage = err?.message || "Failed to extract text from document using OCR";
        setProgressState({
          stage: "failed",
          progressPercentage: 0,
          statusMessage: errorMessage,
          error: errorMessage,
        });
        throw new Error(errorMessage);
      }
    },
    [defaultLang, options.confidenceThreshold]
  );

  return {
    progressState,
    processImageOrPdf,
  };
}
