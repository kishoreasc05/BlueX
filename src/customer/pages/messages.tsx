import { useState } from "react";
import { MessageSquare, Send, User, ChevronRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MOCK_CONVERSATIONS = [
  {
    id: "conv-1",
    name: "Clean & Shine",
    specialty: "Cleaning Service",
    lastMessage: "Sounds good, see you tomorrow at 10 AM!",
    time: "09:42 AM",
    unread: true,
    messages: [
      {
        id: 1,
        sender: "client",
        text: "Hi, I just submitted a booking request for tomorrow. Is 10 AM okay for you?",
        time: "09:30 AM",
      },
      {
        id: 2,
        sender: "provider",
        text: "Hello! Yes, 10 AM works perfectly. Our team is already prepared.",
        time: "09:35 AM",
      },
      {
        id: 3,
        sender: "client",
        text: "Great, I've left instructions for accessing the building in the notes.",
        time: "09:40 AM",
      },
      {
        id: 4,
        sender: "provider",
        text: "Sounds good, see you tomorrow at 10 AM!",
        time: "09:42 AM",
      },
    ],
  },
  {
    id: "conv-2",
    name: "Quick Fix Plumbing",
    specialty: "Plumbing Service",
    lastMessage: "I can come over at 2 PM to check the water heater.",
    time: "Yesterday",
    unread: false,
    messages: [
      {
        id: 1,
        sender: "client",
        text: "Hi, do you have availability today? There's a small leak under the sink.",
        time: "Yesterday, 11:00 AM",
      },
      {
        id: 2,
        sender: "provider",
        text: "Hi! I can come over at 2 PM to check the water heater.",
        time: "Yesterday, 11:15 AM",
      },
    ],
  },
];

export function ClientMessagesPage() {
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState("conv-1");
  const [typedMessage, setTypedMessage] = useState("");

  const activeConv = conversations.find((c) => c.id === activeConvId);

  const sendMessage = () => {
    if (!typedMessage.trim() || !activeConv) return;

    const newMsg = {
      id: activeConv.messages.length + 1,
      sender: "client",
      text: typedMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId
          ? {
              ...c,
              lastMessage: typedMessage,
              time: "Just now",
              unread: false,
              messages: [...c.messages, newMsg],
            }
          : c,
      ),
    );
    setTypedMessage("");
  };

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

      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden h-[600px] grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr]">
        {/* Left pane: Conversations List */}
        <div className="border-r border-slate-200 flex flex-col h-full bg-slate-50/50">
          <div className="p-4 border-b border-slate-200 bg-white">
            <h3 className="font-bold text-slate-900 text-sm">Recent Chats</h3>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {conversations.map((conv) => {
              const isActive = conv.id === activeConvId;
              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    setActiveConvId(conv.id);
                    // Mark as read
                    setConversations((prev) =>
                      prev.map((c) => (c.id === conv.id ? { ...c, unread: false } : c)),
                    );
                  }}
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
                      className={`text-[11px] truncate mt-1 ${conv.unread ? "font-bold text-slate-900" : "text-slate-500"}`}
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
        {activeConv ? (
          <div className="flex flex-col h-full bg-white justify-between">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h3 className="font-black text-slate-900 text-sm">{activeConv.name}</h3>
                <span className="text-[10px] text-slate-400 font-semibold">
                  {activeConv.specialty}
                </span>
              </div>
            </div>

            {/* Messages body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
              <div className="mx-auto max-w-sm bg-blue-50/60 border border-blue-100 rounded-xl p-3 text-[10px] text-blue-700 flex gap-2 font-medium">
                <Info className="h-4 w-4 shrink-0 text-blue-600" />
                <span>
                  For your privacy and protection, communication remains inside BlueX. Contact
                  details are hidden until bookings are confirmed.
                </span>
              </div>

              {activeConv.messages.map((msg) => {
                const isMe = msg.sender === "client";
                return (
                  <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-xs shadow-sm leading-relaxed ${
                        isMe
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-white text-slate-800 border border-slate-200 rounded-bl-none"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span
                        className={`text-[8px] mt-1 block text-right ${isMe ? "text-blue-100" : "text-slate-400"}`}
                      >
                        {msg.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Footer */}
            <div className="p-4 border-t border-slate-200 bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="flex gap-2"
              >
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
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
            <MessageSquare className="h-12 w-12 text-slate-300" />
            <p className="text-sm">Select a conversation to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
}
