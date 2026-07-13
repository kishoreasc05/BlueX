import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, Send, User, ChevronRight, Info, Zap, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useActiveOrg } from "@/hooks/use-orgs";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

export function ClientMessagesPage() {
  const { user } = useAuth();
  const { activeId } = useActiveOrg();
  const queryClient = useQueryClient();
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);
  const [typedMessage, setTypedMessage] = useState("");

  const portalRole = user?.user_metadata?.portal_role || "client";

  // Query Bookings that represent eligible chats
  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ["clientBookingsForChats", user?.id, activeId, portalRole],
    enabled: !!user?.id,
    queryFn: async () => {
      let query = supabase
        .from("bookings")
        .select(`
          id,
          status,
          scheduled_at,
          duration_hours,
          total_price,
          quick_booking_enabled,
          client:profiles!bookings_client_id_fkey(id, full_name, email),
          provider:organizations(id, name, created_by),
          service:provider_services(name)
        `);

      if (portalRole === "provider") {
        if (!activeId) return [];
        query = query.eq("provider_id", activeId);
      } else {
        query = query.eq("client_id", user!.id);
      }

      const { data, error } = await query.order("scheduled_at", { ascending: false });

      if (error) throw error;
      return (data || []) as any[];
    },
  });

  // Query real messages
  const { data: dbMessages, isLoading: messagesLoading } = useQuery({
    queryKey: ["messagesForUser", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${user!.id},receiver_id.eq.${user!.id}`)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return (data || []) as any[];
    },
  });

  // Setup Realtime subscription for messages and bookings
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel("realtime-messages-and-bookings")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["messagesForUser"] });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["clientBookingsForChats"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  const activeBooking = bookings?.find((b) => b.id === activeBookingId);
  const activeMessages = dbMessages?.filter((m) => m.booking_id === activeBookingId) || [];

  const [quickDate, setQuickDate] = useState("");
  const [quickTime, setQuickTime] = useState("09:00");
  const [quickDuration, setQuickDuration] = useState(2);
  const [localQuickBookingEnabled, setLocalQuickBookingEnabled] = useState(false);
  const [quickBookModalOpen, setQuickBookModalOpen] = useState(false);

  useEffect(() => {
    if (activeBooking) {
      setLocalQuickBookingEnabled(activeBooking.quick_booking_enabled || false);
    }
  }, [activeBooking?.id, activeBooking?.quick_booking_enabled]);

  const toggleQuickBooking = useMutation({
    mutationFn: async (newValue: boolean) => {
      if (!activeBookingId) return;
      const { error } = await supabase
        .from("bookings")
        .update({ quick_booking_enabled: newValue })
        .eq("id", activeBookingId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientBookingsForChats"] });
      toast.success("Quick booking preference updated!");
    },
    onError: (e: any) => {
      toast.error(e.message || "Failed to update preference.");
    },
  });

  const quickBookMutation = useMutation({
    mutationFn: async () => {
      if (!user || !activeBooking) return;
      if (!quickDate) throw new Error("Please select a date.");

      // Parse date and time
      const [hours, minutes] = quickTime.split(":");
      const scheduledDate = new Date(quickDate);
      scheduledDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const providerRaw = activeBooking.provider;
      const providerObj = Array.isArray(providerRaw) ? providerRaw[0] : providerRaw;
      const rate = activeBooking.total_price && activeBooking.duration_hours
        ? Number(activeBooking.total_price) / Number(activeBooking.duration_hours)
        : 90;

      const total = rate * quickDuration;

      // Encode booking request details in message (no new booking record created)
      const requestPayload = JSON.stringify({
        scheduledAt: scheduledDate.toISOString(),
        durationHours: quickDuration,
        totalPrice: total,
        providerId: providerObj.id,
        providerCreatedBy: providerObj.created_by,
        clientId: user.id,
      });

      const { error: msgError } = await supabase.from("messages").insert({
        sender_id: user.id,
        receiver_id: providerObj.created_by,
        booking_id: activeBookingId,
        content: `[BOOKING_REQUEST:${requestPayload}]`,
      });

      if (msgError) throw msgError;
    },
    onSuccess: () => {
      toast.success("Booking request sent! Waiting for provider confirmation.");
      setQuickDate("");
      setQuickBookModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["messagesForUser"] });
    },
    onError: (e: any) => {
      toast.error(e.message || "Failed to submit booking request.");
    },
  });

  const updateBookingStatus = useMutation({
    mutationFn: async ({ msgId, msgContent, newStatus }: { msgId: string; msgContent: string; newStatus: "confirmed" | "cancelled" }) => {
      const providerRaw = activeBooking.provider;
      const providerObj = Array.isArray(providerRaw) ? providerRaw[0] : providerRaw;
      const receiverId = portalRole === "provider" ? (activeBooking.client as any)?.id : providerObj.created_by;

      if (newStatus === "confirmed") {
        // Parse the booking request payload from the message content
        const jsonStr = msgContent.replace("[BOOKING_REQUEST:", "").slice(0, -1);
        const payload = JSON.parse(jsonStr);

        // Create the actual booking now that provider accepted
        const { error: bookingError } = await supabase
          .from("bookings")
          .insert({
            client_id: payload.clientId,
            provider_id: payload.providerId,
            scheduled_at: payload.scheduledAt,
            duration_hours: payload.durationHours,
            total_price: payload.totalPrice,
            notes: "Quick Booking accepted from chat thread.",
            status: "confirmed",
          });

        if (bookingError) throw bookingError;
      }

      // Update the original message to mark it as handled
      const content = newStatus === "confirmed"
        ? "✅ Booking request accepted!"
        : "❌ Booking request declined.";

      // Mark the booking request message as resolved by appending status
      await supabase
        .from("messages")
        .update({ content: `${msgContent}|STATUS:${newStatus}` })
        .eq("id", msgId);

      // Post notification message
      await supabase.from("messages").insert({
        sender_id: user!.id,
        receiver_id: receiverId,
        booking_id: activeBookingId,
        content,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientBookingsForChats"] });
      queryClient.invalidateQueries({ queryKey: ["messagesForUser"] });
      toast.success("Booking request updated!");
    },
    onError: (e: any) => {
      toast.error(e.message || "Failed to update booking request.");
    },
  });

  // Mutation to send a message
  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      if (!user || !activeBookingId || !activeBooking || !typedMessage.trim()) return;

      let receiverId = "";
      if (portalRole === "provider") {
        receiverId = (activeBooking.client as any)?.id;
      } else {
        const providerRaw = activeBooking.provider;
        const providerObj = Array.isArray(providerRaw) ? providerRaw[0] : providerRaw;
        receiverId = providerObj?.created_by;
      }

      if (!receiverId) throw new Error("Could not determine recipient user.");

      const { error } = await supabase.from("messages").insert({
        sender_id: user.id,
        receiver_id: receiverId,
        booking_id: activeBookingId,
        content: typedMessage.trim(),
      });

      if (error) throw error;
    },
    onSuccess: () => {
      setTypedMessage("");
      queryClient.invalidateQueries({ queryKey: ["messagesForUser"] });
    },
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessageMutation.mutate();
  };

  // Build the list of active chats
  // Deduplicate by partner: keep only the booking that has messages (or oldest) per provider/client pair
  const allConversations = (bookings || []).map((booking) => {
    const messages = dbMessages?.filter((m) => m.booking_id === booking.id) || [];
    const lastMsg = messages[messages.length - 1];

    const providerRaw = booking.provider;
    const providerObj = Array.isArray(providerRaw) ? providerRaw[0] : providerRaw;
    const serviceRaw = booking.service;
    const serviceObj = Array.isArray(serviceRaw) ? serviceRaw[0] : serviceRaw;

    const chatPartnerName = portalRole === "provider"
      ? (booking.client as any)?.full_name || "Client"
      : providerObj?.name || "Service Provider";

    const partnerId = portalRole === "provider"
      ? (booking.client as any)?.id
      : providerObj?.id;

    return {
      id: booking.id,
      partnerId,
      name: chatPartnerName,
      specialty: serviceObj?.name || "General Service",
      lastMessage: lastMsg ? lastMsg.content : "No messages yet. Say hello!",
      hasMessages: messages.length > 0,
      time: lastMsg
        ? new Date(lastMsg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : new Date(booking.scheduled_at).toLocaleDateString([], { month: "short", day: "numeric" }),
      unread: lastMsg ? !lastMsg.is_read && lastMsg.sender_id !== user?.id : false,
      messages,
    };
  });

  // Deduplicate: per partner, prefer the one with messages; if tie, keep oldest (first in list)
  const seenPartners = new Set<string>();
  const conversations = allConversations.filter((conv) => {
    if (!conv.partnerId) return true; // always show if no partnerId
    if (seenPartners.has(conv.partnerId)) return false;
    // Check if a sibling with messages exists — prefer that one
    const siblings = allConversations.filter((c) => c.partnerId === conv.partnerId);
    const withMessages = siblings.find((c) => c.hasMessages);
    const preferred = withMessages || siblings[0];
    if (preferred.id === conv.id) {
      seenPartners.add(conv.partnerId);
      return true;
    }
    return false;
  });

  // Automatically select the first chat if none is active, or select one from URL parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bookingParam = params.get("bookingId");
    if (bookingParam) {
      setActiveBookingId(bookingParam);
      // Clean query parameter from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (!activeBookingId && conversations.length > 0) {
      setActiveBookingId(conversations[0].id);
    }
  }, [conversations, activeBookingId]);

  const isLoading = bookingsLoading || messagesLoading;

  const currentChatPartnerName = activeBooking
    ? (portalRole === "provider"
        ? (activeBooking.client as any)?.full_name || "Client"
        : (Array.isArray(activeBooking.provider) ? activeBooking.provider[0] : activeBooking.provider)?.name || "Service Provider")
    : null;
  const currentChatService = activeBooking
    ? (Array.isArray(activeBooking.service) ? activeBooking.service[0] : activeBooking.service)
    : null;

  return (
    <div className="space-y-6 pb-12 max-w-[1400px] mx-auto text-slate-800">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-blue-600" />
          Messages
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Secure in-app communication with your service providers.
        </p>
      </div>

      {isLoading ? (
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-12 text-center text-slate-400 font-medium">
          Loading chats...
        </div>
      ) : conversations.length === 0 ? (
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-12 text-center max-w-md mx-auto space-y-4">
          <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto text-blue-600">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900">No chats available</h3>
            <p className="text-xs text-slate-400">
              Messaging becomes available after you make a service booking request.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden h-[calc(100vh-220px)] min-h-[500px] grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr]">
          {/* Left pane: Conversations List */}
          <div className="border-r border-slate-200 flex flex-col h-full bg-slate-50/50">
            <div className="p-4 border-b border-slate-200 bg-white">
              <h3 className="font-bold text-slate-900 text-sm">Recent Chats</h3>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {conversations.map((conv) => {
                const isActive = conv.id === activeBookingId;
                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveBookingId(conv.id)}
                    className={`p-4 flex gap-3 cursor-pointer transition-colors ${
                      isActive
                        ? "bg-blue-50/50 border-r-2 border-blue-600"
                        : "bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{conv.name}</h4>
                        <span className="text-[9px] text-slate-400 font-semibold">{conv.time}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block font-semibold">
                        {conv.specialty}
                      </span>
                      <p
                        className={`text-[11px] truncate mt-1 ${
                          conv.unread ? "font-bold text-slate-900" : "text-slate-500"
                        }`}
                      >
                        {conv.lastMessage}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right pane: Chat Area */}
          {activeBooking ? (
            <div className="flex flex-col h-full bg-white overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white shrink-0">
                <div>
                  <h3 className="font-black text-slate-900 text-sm">
                    {currentChatPartnerName}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {currentChatService?.name || "General Service"}
                  </span>
                </div>

                {portalRole === "provider" && activeBooking && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Allow Quick Booking
                    </span>
                    <Switch
                      checked={localQuickBookingEnabled}
                      onCheckedChange={(checked) => {
                        setLocalQuickBookingEnabled(checked);
                        toggleQuickBooking.mutate(checked);
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Messages body */}
              <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
                <div className="mx-auto max-w-sm bg-blue-50/60 border border-blue-100 rounded-xl p-3 text-[10px] text-blue-700 flex gap-2 font-medium">
                  <Info className="h-4 w-4 shrink-0 text-blue-600" />
                  <span>
                    For your privacy and protection, communication remains inside BlueX. Contact
                    details are hidden until bookings are confirmed.
                  </span>
                </div>

                {activeMessages.map((msg) => {
                  const isMe = msg.sender_id === user?.id;

                  // Check if it's a booking request card
                  if (msg.content.startsWith("[BOOKING_REQUEST:")) {
                    // Check if already resolved (has |STATUS: suffix)
                    const hasStatus = msg.content.includes("|STATUS:");
                    const rawContent = hasStatus ? msg.content.split("|STATUS:")[0] : msg.content;
                    const resolvedStatus = hasStatus ? msg.content.split("|STATUS:")[1] : null;

                    let bDate = "Unknown";
                    let bDuration = 2;
                    let bPrice = 0;

                    try {
                      const jsonStr = rawContent.replace("[BOOKING_REQUEST:", "").slice(0, -1);
                      const payload = JSON.parse(jsonStr);
                      bDate = new Date(payload.scheduledAt).toLocaleDateString("en-US", {
                        weekday: "short", month: "short", day: "numeric",
                        hour: "2-digit", minute: "2-digit"
                      });
                      bDuration = payload.durationHours;
                      bPrice = payload.totalPrice;
                    } catch {}

                    const bStatus = resolvedStatus || "pending";

                    return (
                      <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"} my-2`}>
                        <div className="max-w-[80%] rounded-2xl p-4 bg-white border border-slate-200 shadow-sm space-y-3">
                          <div className="flex items-center gap-2 text-xs font-black text-slate-900 border-b border-slate-100 pb-2">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            <span>📅 Booking Request</span>
                            <span className={`ml-auto px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                              bStatus === "confirmed" ? "bg-emerald-50 text-emerald-700" :
                              bStatus === "cancelled" ? "bg-red-50 text-red-700" :
                              "bg-amber-50 text-amber-700"
                            }`}>
                              {bStatus}
                            </span>
                          </div>

                          <div className="text-[11px] space-y-1 font-semibold">
                            <div className="flex justify-between gap-6">
                              <span className="text-slate-400">Proposed Slot</span>
                              <span>{bDate}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Duration</span>
                              <span>{bDuration} hours</span>
                            </div>
                            <div className="flex justify-between font-bold text-slate-800 pt-1">
                              <span>Estimate Price</span>
                              <span>CHF {Number(bPrice).toFixed(2)}</span>
                            </div>
                          </div>

                          {/* Accept / Decline actions */}
                          {portalRole === "provider" && bStatus === "pending" && (
                            <div className="flex gap-2 pt-1">
                              <Button
                                onClick={() => updateBookingStatus.mutate({ msgId: msg.id, msgContent: rawContent, newStatus: "confirmed" })}
                                disabled={updateBookingStatus.isPending}
                                className="h-7 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold cursor-pointer"
                              >
                                Accept
                              </Button>
                              <Button
                                onClick={() => updateBookingStatus.mutate({ msgId: msg.id, msgContent: rawContent, newStatus: "cancelled" })}
                                disabled={updateBookingStatus.isPending}
                                className="h-7 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold cursor-pointer"
                              >
                                Decline
                              </Button>
                            </div>
                          )}

                          {portalRole === "client" && bStatus === "pending" && (
                            <div className="pt-1">
                              <Button
                                onClick={() => updateBookingStatus.mutate({ msgId: msg.id, msgContent: rawContent, newStatus: "cancelled" })}
                                disabled={updateBookingStatus.isPending}
                                className="h-7 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold cursor-pointer"
                              >
                                Cancel Request
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-xs shadow-sm leading-relaxed ${
                          isMe
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-white text-slate-800 border border-slate-200 rounded-bl-none"
                        }`}
                      >
                        <p>{msg.content}</p>
                        <span
                          className={`text-[8px] mt-1 block text-right ${
                            isMe ? "text-blue-100" : "text-slate-400"
                          }`}
                        >
                          {new Date(msg.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input Footer - always pinned at bottom */}
              <div className="p-4 border-t border-slate-200 bg-white shrink-0">
                <form onSubmit={handleSend} className="flex gap-2">
                  {portalRole === "client" && activeBooking?.quick_booking_enabled && (
                    <Button
                      type="button"
                      onClick={() => setQuickBookModalOpen(true)}
                      size="icon"
                      className="h-10 w-10 bg-amber-500 hover:bg-amber-600 text-white rounded-xl shrink-0 cursor-pointer"
                      title="Quick Book Provider"
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                  )}
                  <Input
                    placeholder="Type a message..."
                    value={typedMessage}
                    onChange={(e) => setTypedMessage(e.target.value)}
                    className="rounded-xl border-slate-200 text-xs h-10"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="h-10 w-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shrink-0 cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>

              <Dialog open={quickBookModalOpen} onOpenChange={setQuickBookModalOpen}>
                <DialogContent className="max-w-md p-6 rounded-2xl border-slate-200">
                  <DialogHeader>
                    <DialogTitle className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Zap className="h-5 w-5 text-amber-500 fill-amber-500 animate-pulse" />
                      Quick Book {currentChatPartnerName}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-slate-400 font-semibold mt-0.5">
                      Select a slot to request a booking instantly.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 pt-3">
                    <div className="space-y-1.5">
                      <label htmlFor="quickDate" className="text-xs font-bold text-slate-700">Date</label>
                      <input
                        id="quickDate"
                        type="date"
                        value={quickDate}
                        onChange={(e) => setQuickDate(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label htmlFor="quickTime" className="text-xs font-bold text-slate-700">Start Time</label>
                        <input
                          id="quickTime"
                          type="time"
                          value={quickTime}
                          onChange={(e) => setQuickTime(e.target.value)}
                          className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="quickDuration" className="text-xs font-bold text-slate-700">Duration</label>
                        <select
                          id="quickDuration"
                          value={quickDuration}
                          onChange={(e) => setQuickDuration(parseInt(e.target.value))}
                          className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                        >
                          <option value={1}>1 hour</option>
                          <option value={2}>2 hours</option>
                          <option value={3}>3 hours</option>
                          <option value={4}>4 hours</option>
                          <option value={6}>6 hours</option>
                          <option value={8}>8 hours</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2.5 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => setQuickBookModalOpen(false)}
                        className="h-9 px-4 rounded-xl border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => quickBookMutation.mutate()}
                        disabled={quickBookMutation.isPending || !quickDate}
                        className="h-9 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold cursor-pointer"
                      >
                        {quickBookMutation.isPending ? "Submitting..." : "Book Instantly"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
              <MessageSquare className="h-12 w-12 text-slate-300" />
              <p className="text-sm">Select a conversation to start chatting.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
