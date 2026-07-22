import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DocumentCategory } from "../types/ocr.types";
import { toast } from "sonner";

interface AutoApprovalOptions {
  confidenceThreshold?: number; // default 70
}

export function useProviderAutoApproval(options: AutoApprovalOptions = {}) {
  const threshold = options.confidenceThreshold || 70;

  const checkAndAutoApprove = useCallback(
    async (params: {
      userId: string;
      documentId: string;
      category: DocumentCategory;
      confidence: number;
      extractedText: string;
    }): Promise<{ isApproved: boolean; message: string }> => {
      const { userId, documentId, category, confidence, extractedText } = params;

      // Only verification categories trigger automatic provider profile approval
      const isVerificationDoc = ["verification_license", "tax_id", "id_proof"].includes(category);

      if (!isVerificationDoc) {
        return {
          isApproved: false,
          message: "General document uploaded. No provider approval action required.",
        };
      }

      // Basic text validation: ensure extracted text contains non-trivial length
      const textLengthValid = (extractedText || "").trim().length > 30;

      if (confidence >= threshold && textLengthValid) {
        try {
          // Call Supabase RPC for automated approval
          const { data, error } = await supabase.rpc("auto_approve_provider_via_ocr", {
            p_user_id: userId,
            p_doc_id: documentId,
            p_confidence: confidence,
          });

          if (error) {
            // Direct fallback update to provider_profiles if RPC is not yet applied
            await supabase
              .from("provider_profiles")
              .update({
                verification_status: "approved",
                is_verified: true,
                updated_at: new Date().toISOString(),
              })
              .eq("user_id", userId);

            await supabase
              .from("ocr_documents")
              .update({ auto_approved: true })
              .eq("id", documentId);
          }

          toast.success(
            "🎉 Provider Account Auto-Approved! OCR document confidence score verified.",
          );

          return {
            isApproved: true,
            message: `Verification passed with ${confidence}% OCR confidence score. Provider automatically approved!`,
          };
        } catch (err: any) {
          console.error("Auto approval error:", err);
          return {
            isApproved: false,
            message: "Failed to set automatic approval status.",
          };
        }
      } else {
        toast.info(
          `OCR confidence (${confidence}%) below ${threshold}% threshold. Please ensure document image is clear.`,
        );
        return {
          isApproved: false,
          message: `Confidence ${confidence}% below required ${threshold}% threshold for automatic approval.`,
        };
      }
    },
    [threshold],
  );

  return {
    checkAndAutoApprove,
  };
}
