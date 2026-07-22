export type DocumentCategory =
  "verification_license" | "tax_id" | "id_proof" | "contract" | "general";

export type OcrStatus = "processing" | "completed" | "failed";

export type OcrProcessingStage =
  | "idle"
  | "validating"
  | "initializing"
  | "rendering_pdf"
  | "recognizing_text"
  | "uploading_cloudinary"
  | "saving_database"
  | "auto_approving"
  | "completed"
  | "failed";

export interface OcrDocument {
  id: string;
  user_id: string;
  organization_id?: string | null;
  document_name: string;
  document_type: string;
  category: DocumentCategory;
  file_url: string | null;
  cloudinary_public_id?: string | null;
  thumbnail_url?: string | null;
  extracted_text: string | null;
  confidence: number;
  auto_approved: boolean;
  status: OcrStatus;
  processing_time_ms: number;
  language: string;
  file_size_bytes: number | null;
  created_at: string;
  updated_at: string;
}

export interface OcrProgressState {
  stage: OcrProcessingStage;
  progressPercentage: number; // 0 - 100
  statusMessage: string;
  currentPage?: number;
  totalPages?: number;
  estimatedTimeRemainingSec?: number;
  error?: string | null;
}

export interface OcrResult {
  text: string;
  confidence: number;
  processingTimeMs: number;
  language: string;
  autoApproved: boolean;
  pageCount: number;
}

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  bytes: number;
  format: string;
}
