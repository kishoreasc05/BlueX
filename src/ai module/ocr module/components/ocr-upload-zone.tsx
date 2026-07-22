import React, { useRef, useState } from "react";
import { Upload, FileText, X, RefreshCw, FileCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentCategory } from "../types/ocr.types";
import { toast } from "sonner";

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB
const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

interface OcrUploadZoneProps {
  onFileSelect: (file: File, category: DocumentCategory) => void;
  disabled?: boolean;
}

export function OcrUploadZone({ onFileSelect, disabled }: OcrUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState<DocumentCategory>("verification_license");

  const validateAndSetFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error(`File size exceeds maximum allowed 20 MB (${(file.size / (1024 * 1024)).toFixed(1)} MB)`);
      return;
    }

    const fileType = file.type || "";
    const extension = file.name.split(".").pop()?.toLowerCase() || "";

    const isAllowed =
      ALLOWED_TYPES.includes(fileType) ||
      ["pdf", "jpg", "jpeg", "png", "webp"].includes(extension);

    if (!isAllowed) {
      toast.error("Unsupported file type. Please upload a PDF, JPG, JPEG, PNG, or WEBP file.");
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleStartOcr = () => {
    if (selectedFile) {
      onFileSelect(selectedFile, category);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Category selector */}
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm font-medium text-foreground">Document Type:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as DocumentCategory)}
          disabled={disabled}
          className="px-3 py-1.5 text-sm rounded-lg border border-border bg-background text-foreground shadow-xs focus:ring-2 focus:ring-primary/20 outline-hidden"
        >
          <option value="verification_license">📜 Business License / Registration (Auto-Verify)</option>
          <option value="tax_id">🏷️ Tax / VAT ID Certificate (Auto-Verify)</option>
          <option value="id_proof">🪪 Government ID / Passport (Auto-Verify)</option>
          <option value="contract">📝 Contract / Agreement</option>
          <option value="general">📄 General Document</option>
        </select>
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !selectedFile && !disabled && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 transition-all text-center flex flex-col items-center justify-center cursor-pointer ${
          isDragOver
            ? "border-primary bg-primary/5 shadow-md scale-[1.01]"
            : "border-border hover:border-primary/50 bg-card/50"
        } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          className="hidden"
          onChange={handleInputChange}
          disabled={disabled}
        />

        {!selectedFile ? (
          <div className="space-y-3 pointer-events-none">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-xs">
              <Upload className="w-7 h-7" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">
                Drag & Drop your document here, or <span className="text-primary underline">browse</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports PDF, JPG, JPEG, PNG, WEBP (Max 20 MB)
              </p>
            </div>
          </div>
        ) : (
          <div
            className="w-full bg-background rounded-xl p-4 border border-border shadow-xs flex items-center justify-between gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="text-left min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type || "Document"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1" /> Replace
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedFile(null)}
                disabled={disabled}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {selectedFile && (
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={() => setSelectedFile(null)} disabled={disabled}>
            Cancel
          </Button>
          <Button onClick={handleStartOcr} disabled={disabled} className="shadow-xs">
            <FileCheck className="w-4 h-4 mr-2" /> Start Tesseract OCR & Auto-Verify
          </Button>
        </div>
      )}
    </div>
  );
}
