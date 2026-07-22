import { useState, useCallback } from "react";
import { CloudinaryUploadResponse } from "../types/ocr.types";
import { supabase } from "@/integrations/supabase/client";

export function useCloudinaryUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (file: File): Promise<{ url: string; publicId: string }> => {
    setUploading(true);
    setError(null);

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    // Check if Cloudinary is configured
    if (cloudName && uploadPreset && cloudName !== "demo") {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error?.message || "Cloudinary upload failed");
        }

        const data: CloudinaryUploadResponse = await response.json();
        setUploading(false);
        return {
          url: data.secure_url,
          publicId: data.public_id,
        };
      } catch (err: any) {
        console.warn("Cloudinary upload failed, falling back to Supabase storage:", err.message);
      }
    }

    // Fallback: Upload to Supabase Storage if Cloudinary credentials are not set up yet
    try {
      const fileName = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const filePath = `ocr-documents/${fileName}`;

      const { data, error: sbErr } = await supabase.storage
        .from("documents")
        .upload(filePath, file, { upsert: true });

      if (sbErr) {
        // If bucket doesn't exist, generate a local blob URL preview
        const blobUrl = URL.createObjectURL(file);
        setUploading(false);
        return {
          url: blobUrl,
          publicId: fileName,
        };
      }

      const { data: pubData } = supabase.storage.from("documents").getPublicUrl(data.path);

      setUploading(false);
      return {
        url: pubData.publicUrl,
        publicId: data.path,
      };
    } catch (fallbackErr: any) {
      setUploading(false);
      const blobUrl = URL.createObjectURL(file);
      return {
        url: blobUrl,
        publicId: file.name,
      };
    }
  }, []);

  return {
    uploading,
    error,
    uploadFile,
  };
}
