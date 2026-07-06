import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/invite/$token")({
  ssr: false,
  component: AcceptInvite,
});

function AcceptInvite() {
  const { token } = Route.useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"idle" | "working" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user) {
      sessionStorage.setItem("bluex.pendingInvite", token);
      navigate({ to: "/signin", search: { mode: "signup" } });
      return;
    }
    (async () => {
      setStatus("working");
      const { data: invite, error } = await supabase
        .from("organization_invites")
        .select("*")
        .eq("token", token)
        .maybeSingle();
      if (error || !invite) { setStatus("error"); setMessage("Invite not found or already used."); return; }
      if (invite.accepted_at) { setStatus("error"); setMessage("This invite has already been used."); return; }
      if (new Date(invite.expires_at) < new Date()) { setStatus("error"); setMessage("This invite has expired."); return; }

      const { error: memErr } = await supabase.from("organization_members").insert({
        organization_id: invite.organization_id,
        user_id: user.id,
        role: invite.role,
      });
      if (memErr && !memErr.message.includes("duplicate")) {
        setStatus("error"); setMessage(memErr.message); return;
      }
      await supabase.from("organization_invites").update({ accepted_at: new Date().toISOString() }).eq("id", invite.id);
      localStorage.setItem("bluex.activeOrgId", invite.organization_id);
      toast.success("Joined workspace");
      setStatus("done");
      setTimeout(() => navigate({ to: "/dashboard" }), 600);
    })();
  }, [token, user, loading, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-sm rounded-xl border border-border bg-card p-8 text-center">
        <h1 className="text-lg font-semibold">Workspace invite</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {status === "working" && "Joining workspace…"}
          {status === "done" && "Welcome aboard! Redirecting…"}
          {status === "error" && message}
          {status === "idle" && "Preparing…"}
        </p>
        {status === "error" && (
          <Button className="mt-4" onClick={() => navigate({ to: "/dashboard" })}>Go to dashboard</Button>
        )}
      </div>
    </div>
  );
}