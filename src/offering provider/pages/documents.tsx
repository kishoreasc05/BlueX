import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Upload, FileText, Trash2, Download } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useActiveOrg } from "@/hooks/use-orgs";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/app-shell";
import { EmptyState } from "@/components/kpi-card";
import { EntityTable } from "@/components/entity-table";
import { Button } from "@/components/ui/button";

type Doc = {
  id: string;
  name: string;
  file_path: string;
  mime_type: string | null;
  size_bytes: number | null;
  created_at: string;
};

function formatBytes(n: number | null) {
  if (!n) return "—";
  const u = ["B", "KB", "MB", "GB"];
  let i = 0;
  let v = n;
  while (v >= 1024 && i < u.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(v < 10 ? 1 : 0)} ${u[i]}`;
}

export function DocumentsPage() {
  const { activeId } = useActiveOrg();
  const { user } = useAuth();
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const docs = useQuery({
    queryKey: ["documents", activeId],
    enabled: !!activeId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("organization_id", activeId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Doc[];
    },
  });

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0 || !activeId || !user) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const path = `${activeId}/${crypto.randomUUID()}-${file.name}`;
        const { error: upErr } = await supabase.storage.from("documents").upload(path, file);
        if (upErr) throw upErr;
        const { error: dbErr } = await supabase.from("documents").insert({
          organization_id: activeId,
          name: file.name,
          file_path: path,
          mime_type: file.type || null,
          size_bytes: file.size,
          uploaded_by: user.id,
        });
        if (dbErr) throw dbErr;
        await supabase.from("activity_log").insert({
          organization_id: activeId,
          actor_id: user.id,
          action: "uploaded",
          entity_type: "document",
          metadata: { name: file.name },
        });
      }
      toast.success(`${files.length} file${files.length > 1 ? "s" : ""} uploaded`);
      qc.invalidateQueries({ queryKey: ["documents"] });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const remove = useMutation({
    mutationFn: async (d: Doc) => {
      await supabase.storage.from("documents").remove([d.file_path]);
      const { error } = await supabase.from("documents").delete().eq("id", d.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["documents"] });
    },
  });

  async function download(d: Doc) {
    const { data, error } = await supabase.storage
      .from("documents")
      .createSignedUrl(d.file_path, 60);
    if (error) {
      toast.error(error.message);
      return;
    }
    window.open(data.signedUrl, "_blank");
  }

  return (
    <div>
      <PageHeader
        title="Documents"
        description="Contracts, briefs, and files — securely stored per workspace."
        action={
          <>
            <input
              ref={fileRef}
              type="file"
              multiple
              hidden
              onChange={(e) => handleUpload(e.target.files)}
            />
            <Button onClick={() => fileRef.current?.click()} disabled={uploading}>
              <Upload className="h-4 w-4" /> {uploading ? "Uploading…" : "Upload"}
            </Button>
          </>
        }
      />
      {docs.data && docs.data.length > 0 ? (
        <EntityTable
          rows={docs.data}
          columns={[
            {
              key: "name",
              header: "Name",
              render: (d) => (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{d.name}</span>
                </div>
              ),
            },
            {
              key: "type",
              header: "Type",
              render: (d) => (
                <span className="text-xs text-muted-foreground">{d.mime_type ?? "—"}</span>
              ),
            },
            { key: "size", header: "Size", render: (d) => formatBytes(d.size_bytes) },
            {
              key: "when",
              header: "Uploaded",
              render: (d) => formatDistanceToNow(new Date(d.created_at), { addSuffix: true }),
            },
            {
              key: "actions",
              header: "",
              className: "w-24",
              render: (d) => (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => download(d)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete ${d.name}?`)) remove.mutate(d);
                    }}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ),
            },
          ]}
        />
      ) : (
        <EmptyState
          icon={FileText}
          title="No documents yet"
          description="Upload contracts, briefs and files. The AI assistant can summarize them for you."
          action={
            <Button onClick={() => fileRef.current?.click()}>
              <Upload className="h-4 w-4" /> Upload
            </Button>
          }
        />
      )}
      {docs.data?.length === 0 && (
        <input
          ref={fileRef}
          type="file"
          multiple
          hidden
          onChange={(e) => handleUpload(e.target.files)}
        />
      )}
    </div>
  );
}
