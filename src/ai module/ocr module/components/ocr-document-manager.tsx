import React, { useState } from "react";
import {
  Search,
  Filter,
  FileText,
  Eye,
  Edit3,
  Trash2,
  Download,
  ShieldCheck,
  Award,
  Plus,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OcrUploadZone } from "./ocr-upload-zone";
import { OcrProgressCard } from "./ocr-progress-card";
import { OcrResultEditor } from "./ocr-result-editor";
import { DocumentViewerModal } from "./document-viewer-modal";
import { OcrDashboardStats } from "./ocr-dashboard-stats";
import { useOcrDocuments } from "../hooks/use-ocr-documents";
import { useTesseractOcr } from "../hooks/use-tesseract-ocr";
import { useCloudinaryUpload } from "../hooks/use-cloudinary-upload";
import { useProviderAutoApproval } from "../hooks/use-provider-auto-approval";
import { OcrDocument, DocumentCategory, OcrStatus } from "../types/ocr.types";
import { useAuth } from "@/hooks/use-auth";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

interface OcrDocumentManagerProps {
  targetUserId?: string; // Optional: filter documents for a specific provider (e.g., in Admin profile view)
  readOnly?: boolean;
}

export function OcrDocumentManager({ targetUserId, readOnly }: OcrDocumentManagerProps) {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OcrStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Active OCR processing state
  const [activeFile, setActiveFile] = useState<File | null>(null);
  const [activeResult, setActiveResult] = useState<{
    docId?: string;
    text: string;
    confidence: number;
    processingTimeMs: number;
    language: string;
    autoApproved: boolean;
  } | null>(null);

  // Modal view states
  const [viewingDoc, setViewingDoc] = useState<OcrDocument | null>(null);
  const [editingDoc, setEditingDoc] = useState<OcrDocument | null>(null);

  // Custom Hooks
  const { documents, isLoading, saveDocument, updateText, deleteDocument } = useOcrDocuments({
    search,
    status: statusFilter,
    category: categoryFilter,
    targetUserId,
  });

  const { progressState, processImageOrPdf } = useTesseractOcr();
  const { uploadFile } = useCloudinaryUpload();
  const { checkAndAutoApprove } = useProviderAutoApproval();

  // Handle new document OCR execution
  const handleStartOcr = async (file: File, category: DocumentCategory) => {
    setActiveFile(file);
    try {
      // 1. Run Tesseract.js local OCR
      const result = await processImageOrPdf(file);

      // 2. Upload original file to Cloudinary (or Supabase fallback)
      const uploadRes = await uploadFile(file);

      // 3. Save initial OCR document metadata to PostgreSQL/Supabase
      const savedDoc = await saveDocument({
        document_name: file.name,
        document_type: file.type || file.name.split(".").pop() || "pdf",
        category,
        file_url: uploadRes.url,
        cloudinary_public_id: uploadRes.publicId,
        extracted_text: result.text,
        confidence: result.confidence,
        status: "completed",
        processing_time_ms: result.processingTimeMs,
        language: result.language,
        file_size_bytes: file.size,
        auto_approved: false,
      });

      // 4. Trigger automated provider profile verification check if applicable
      let autoApproved = false;
      if (user?.id) {
        const approvalRes = await checkAndAutoApprove({
          userId: user.id,
          documentId: savedDoc.id,
          category,
          confidence: result.confidence,
          extractedText: result.text,
        });
        autoApproved = approvalRes.isApproved;
      }

      setActiveResult({
        docId: savedDoc.id,
        text: result.text,
        confidence: result.confidence,
        processingTimeMs: result.processingTimeMs,
        language: result.language,
        autoApproved,
      });

      setShowUploadModal(false);
      toast.success("Document OCR processing completed!");
    } catch (err: any) {
      toast.error(err.message || "OCR Processing failed");
    }
  };

  const handleUpdateText = async (newText: string) => {
    if (editingDoc) {
      await updateText({ id: editingDoc.id, text: newText });
      setEditingDoc(null);
    } else if (activeResult?.docId) {
      await updateText({ id: activeResult.docId, text: newText });
      setActiveResult(null);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Dashboard KPIs */}
      <OcrDashboardStats targetUserId={targetUserId} />

      {/* Main Toolbar & Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by document name or OCR text content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>

        {/* Filters & Add Upload */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OcrStatus | "all")}
            className="px-3 py-2 text-xs rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 outline-hidden"
          >
            <option value="all">All Categories</option>
            <option value="verification_license">Business License</option>
            <option value="tax_id">Tax / VAT ID</option>
            <option value="id_proof">Government ID</option>
            <option value="contract">Contracts</option>
            <option value="general">General</option>
          </select>

          {!readOnly && (
            <Button
              onClick={() => {
                setActiveResult(null);
                setShowUploadModal(true);
              }}
              className="shadow-xs"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Upload & Scan OCR
            </Button>
          )}
        </div>
      </div>

      {/* Active Upload & OCR Execution Section */}
      {showUploadModal && (
        <div className="bg-card border border-primary/30 rounded-2xl p-6 shadow-md space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-base font-semibold text-foreground">Upload Document for OCR Scan</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowUploadModal(false)}>
              Close
            </Button>
          </div>
          <OcrUploadZone onFileSelect={handleStartOcr} disabled={progressState.stage !== "idle" && progressState.stage !== "completed" && progressState.stage !== "failed"} />

          {progressState.stage !== "idle" && activeFile && (
            <OcrProgressCard progress={progressState} documentName={activeFile.name} />
          )}
        </div>
      )}

      {/* Active Result Preview/Edit after fresh upload */}
      {activeResult && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Fresh OCR Result Preview</h3>
            <Button variant="ghost" size="sm" onClick={() => setActiveResult(null)}>
              Dismiss Preview
            </Button>
          </div>
          <OcrResultEditor
            initialText={activeResult.text}
            confidence={activeResult.confidence}
            processingTimeMs={activeResult.processingTimeMs}
            language={activeResult.language}
            autoApproved={activeResult.autoApproved}
            onSave={handleUpdateText}
          />
        </div>
      )}

      {/* Editing Existing Document Text Modal */}
      {editingDoc && (
        <div className="space-y-2 bg-card p-6 rounded-2xl border border-primary/30 shadow-lg">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-sm font-semibold text-foreground">Edit OCR Content: {editingDoc.document_name}</h3>
            <Button variant="ghost" size="sm" onClick={() => setEditingDoc(null)}>
              Cancel Editing
            </Button>
          </div>
          <OcrResultEditor
            initialText={editingDoc.extracted_text || ""}
            confidence={editingDoc.confidence}
            processingTimeMs={editingDoc.processing_time_ms}
            language={editingDoc.language}
            autoApproved={editingDoc.auto_approved}
            onSave={handleUpdateText}
          />
        </div>
      )}

      {/* Document Data Table */}
      <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground text-sm flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-primary" /> Loading documents...
          </div>
        ) : documents.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-muted/50 text-muted-foreground flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">No OCR documents found</p>
              <p className="text-xs text-muted-foreground mt-1">
                Upload business licenses, tax documents, or files to perform local OCR character recognition.
              </p>
            </div>
            {!readOnly && (
              <Button size="sm" onClick={() => setShowUploadModal(true)}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Upload First Document
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 border-b border-border text-xs uppercase font-semibold text-muted-foreground">
                <tr>
                  <th className="py-3.5 px-4">Document Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Confidence</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Created</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate max-w-xs">
                            {doc.document_name}
                          </p>
                          <p className="text-xs text-muted-foreground uppercase">
                            {doc.document_type} • {doc.file_size_bytes ? `${(doc.file_size_bytes / 1024).toFixed(0)} KB` : "File"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-muted text-muted-foreground capitalize">
                        {doc.category.replace("_", " ")}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <Award
                          className={`w-4 h-4 ${
                            doc.confidence >= 80
                              ? "text-emerald-500"
                              : doc.confidence >= 50
                              ? "text-amber-500"
                              : "text-rose-500"
                          }`}
                        />
                        <span className="font-semibold text-foreground text-xs">
                          {doc.confidence}%
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {doc.auto_approved ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          <ShieldCheck className="w-3 h-3" /> Auto-Approved
                        </span>
                      ) : (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                            doc.status === "completed"
                              ? "bg-blue-500/10 text-blue-600"
                              : doc.status === "failed"
                              ? "bg-rose-500/10 text-rose-600"
                              : "bg-amber-500/10 text-amber-600 animate-pulse"
                          }`}
                        >
                          {doc.status}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-xs text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(new Date(doc.created_at), { addSuffix: true })}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* View File Modal */}
                        {doc.file_url && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setViewingDoc(doc)}
                            title="Preview Document"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}

                        {/* Edit OCR Text */}
                        {!readOnly && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingDoc(doc)}
                            title="Review / Edit OCR Text"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        )}

                        {/* Delete */}
                        {!readOnly && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (confirm(`Delete OCR document "${doc.document_name}"?`)) {
                                deleteDocument(doc.id);
                              }
                            }}
                            title="Delete Document"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Document Viewer Modal */}
      {viewingDoc && (
        <DocumentViewerModal
          isOpen={!!viewingDoc}
          onClose={() => setViewingDoc(null)}
          fileUrl={viewingDoc.file_url}
          fileName={viewingDoc.document_name}
          fileType={viewingDoc.document_type}
        />
      )}
    </div>
  );
}
