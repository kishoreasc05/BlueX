import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { OcrDocument, DocumentCategory, OcrStatus } from "../types/ocr.types";
import { useAuth } from "@/hooks/use-auth";
import { useActiveOrg } from "@/hooks/use-orgs";
import { toast } from "sonner";

export interface DocumentFilterOptions {
  search?: string;
  category?: string;
  status?: OcrStatus | "all";
  targetUserId?: string; // Optional: filter by a specific provider/user (e.g. for Admin view)
}

export function useOcrDocuments(filters: DocumentFilterOptions = {}) {
  const { user } = useAuth();
  const { activeId } = useActiveOrg();
  const qc = useQueryClient();

  const documentsQuery = useQuery({
    queryKey: ["ocr-documents", user?.id, activeId, filters],
    queryFn: async () => {
      let query = supabase
        .from("ocr_documents")
        .select("*")
        .order("created_at", { ascending: false });

      if (filters.targetUserId) {
        query = query.eq("user_id", filters.targetUserId);
      } else if (activeId) {
        query = query.or(`user_id.eq.${user?.id},organization_id.eq.${activeId}`);
      } else if (user?.id) {
        query = query.eq("user_id", user.id);
      }

      if (filters.status && filters.status !== "all") {
        query = query.eq("status", filters.status);
      }

      if (filters.category && filters.category !== "all") {
        query = query.eq("category", filters.category);
      }

      const { data, error } = await query;

      if (error) {
        // Return empty array gracefully if table is not yet migrated
        console.warn("Failed to fetch ocr_documents:", error.message);
        return [] as OcrDocument[];
      }

      let results = (data || []) as OcrDocument[];

      if (filters.search && filters.search.trim() !== "") {
        const s = filters.search.toLowerCase();
        results = results.filter(
          (d) =>
            d.document_name.toLowerCase().includes(s) ||
            (d.extracted_text && d.extracted_text.toLowerCase().includes(s))
        );
      }

      return results;
    },
    enabled: !!user,
  });

  const saveDocumentMutation = useMutation({
    mutationFn: async (doc: Partial<OcrDocument>) => {
      if (!user) throw new Error("User must be authenticated");

      const payload = {
        user_id: user.id,
        organization_id: activeId || null,
        document_name: doc.document_name || "Untitled Document",
        document_type: doc.document_type || "pdf",
        category: doc.category || "general",
        file_url: doc.file_url || null,
        cloudinary_public_id: doc.cloudinary_public_id || null,
        thumbnail_url: doc.thumbnail_url || null,
        extracted_text: doc.extracted_text || "",
        confidence: doc.confidence || 0,
        auto_approved: doc.auto_approved || false,
        status: doc.status || "completed",
        processing_time_ms: doc.processing_time_ms || 0,
        language: doc.language || "eng",
        file_size_bytes: doc.file_size_bytes || null,
      };

      const { data, error } = await supabase
        .from("ocr_documents")
        .insert(payload)
        .select()
        .single();

      if (error) throw error;
      return data as OcrDocument;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ocr-documents"] });
    },
  });

  const updateTextMutation = useMutation({
    mutationFn: async ({ id, text }: { id: string; text: string }) => {
      const { data, error } = await supabase
        .from("ocr_documents")
        .update({ extracted_text: text, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as OcrDocument;
    },
    onSuccess: () => {
      toast.success("OCR text updated successfully");
      qc.invalidateQueries({ queryKey: ["ocr-documents"] });
    },
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ocr_documents").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Document deleted");
      qc.invalidateQueries({ queryKey: ["ocr-documents"] });
    },
  });

  return {
    documents: documentsQuery.data || [],
    isLoading: documentsQuery.isLoading,
    refetch: documentsQuery.refetch,
    saveDocument: saveDocumentMutation.mutateAsync,
    updateText: updateTextMutation.mutateAsync,
    deleteDocument: deleteDocumentMutation.mutateAsync,
  };
}

export function useOcrStats(targetUserId?: string) {
  const { documents } = useOcrDocuments({ targetUserId });

  const total = documents.length;
  const completed = documents.filter((d) => d.status === "completed").length;
  const failed = documents.filter((d) => d.status === "failed").length;
  const processing = documents.filter((d) => d.status === "processing").length;
  const autoApproved = documents.filter((d) => d.auto_approved).length;

  return {
    total,
    completed,
    failed,
    processing,
    autoApproved,
  };
}
