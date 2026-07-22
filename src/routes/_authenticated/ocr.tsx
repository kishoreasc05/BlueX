import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { ScanText } from "lucide-react";
import { OcrDocumentManager } from "@/ai module/ocr module";

export const Route = createFileRoute("/_authenticated/ocr")({
  component: OcrModulePage,
});

function OcrModulePage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <PageHeader
        title={
          <div className="flex items-center gap-2.5 text-foreground">
            <ScanText className="h-6 w-6 text-primary" />
            <span>BlueX OCR Module</span>
          </div>
        }
        description="Client-side document OCR character recognition powered by Tesseract.js & Cloudinary storage with automated provider verification."
      />

      <OcrDocumentManager />
    </div>
  );
}
