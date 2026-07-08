import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { toast } from "sonner";
import { Calendar, Clock, DollarSign, Star, MessageSquare } from "lucide-react";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/kpi-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export function ClientBookingsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["clientBookings", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select(
          `
          id, 
          status, 
          scheduled_at, 
          duration_hours, 
          total_price, 
          notes,
          provider_id,
          provider:organizations(id, name),
          service:provider_services(name)
        `,
        )
        .eq("client_id", user!.id)
        .order("scheduled_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const submitReview = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("reviews").insert({
        booking_id: selectedBooking.id,
        client_id: user!.id,
        provider_id: selectedBooking.provider_id,
        rating,
        comment,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Thank you for your feedback!");
      setReviewOpen(false);
      setSelectedBooking(null);
      setComment("");
      setRating(5);
      queryClient.invalidateQueries({ queryKey: ["clientBookings"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="space-y-6 pb-12 max-w-[1400px] mx-auto text-slate-800">
      <PageHeader
        title="My Bookings"
        description="View status, manage schedules, and review your blue-collar service bookings."
      />

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6">
        {isLoading ? (
          <p className="text-sm text-slate-500 text-center py-6">Loading bookings...</p>
        ) : !bookings || bookings.length === 0 ? (
          <EmptyState
            title="No bookings found"
            description="You don't have any bookings. Go to Search Services to book an electrician, plumber, or cleaner."
            icon={Calendar}
          />
        ) : (
          <div className="divide-y divide-slate-100 -mx-6 -my-6">
            {bookings.map((booking: any) => (
              <div
                key={booking.id}
                className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900">
                      {(booking.service as any)?.name || "General Service"}
                    </h3>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                        booking.status === "completed"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : booking.status === "confirmed"
                            ? "bg-blue-50 text-blue-700 border-blue-100"
                            : booking.status === "pending"
                              ? "bg-amber-50 text-amber-700 border-amber-100"
                              : "bg-slate-50 text-slate-700 border-slate-100"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold">
                    Provider: {(booking.provider as any)?.name || "Independent"}
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs text-slate-400 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(booking.scheduled_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(booking.scheduled_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      ({booking.duration_hours}h)
                    </span>
                    <span className="flex items-center gap-0.5">
                      <DollarSign className="w-3.5 h-3.5" />
                      CHF {Number(booking.total_price).toFixed(2)}
                    </span>
                  </div>
                  {booking.notes && (
                    <p className="text-xs text-slate-400 italic bg-slate-50/50 p-2 rounded-lg mt-2">
                      Notes: {booking.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl text-xs gap-1 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Chat
                  </Button>
                  {booking.status === "completed" && (
                    <Button
                      className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs gap-1 cursor-pointer"
                      onClick={() => {
                        setSelectedBooking(booking);
                        setReviewOpen(true);
                      }}
                    >
                      <Star className="w-3.5 h-3.5" /> Review Provider
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Dialog */}
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Leave a Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Rating</label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating ? "fill-amber-400 stroke-amber-400" : "text-slate-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Your Review</label>
              <Textarea
                placeholder="Share your experience hiring this provider..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => submitReview.mutate()}
              disabled={submitReview.isPending}
            >
              {submitReview.isPending ? "Submitting..." : "Submit Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
