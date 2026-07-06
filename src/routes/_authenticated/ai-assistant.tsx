import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { Sparkles, Send, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_authenticated/ai-assistant")({
  component: Page,
});

function Page() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-[1000px] mx-auto pb-6">
      <PageHeader 
        title={
          <div className="flex items-center gap-2 text-indigo-700">
            <Sparkles className="h-6 w-6" /> AI Copilot
          </div>
        }
        description="Your intelligent business assistant."
      />
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          <div className="flex gap-4">
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
              <Bot className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl rounded-tl-none text-sm text-slate-700 max-w-[80%]">
              Hello! I'm your BlueX AI Copilot. I can help you analyze reports, draft contracts, or summarize your recent activity. How can I assist you today?
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4 max-w-[80%] ml-12">
            <Button variant="outline" className="justify-start h-auto py-3 px-4 text-left text-sm whitespace-normal">
              Summarize all project updates from this week
            </Button>
            <Button variant="outline" className="justify-start h-auto py-3 px-4 text-left text-sm whitespace-normal">
              Generate a draft NDA for Acme Corp
            </Button>
            <Button variant="outline" className="justify-start h-auto py-3 px-4 text-left text-sm whitespace-normal">
              Analyze Q2 financial reports
            </Button>
            <Button variant="outline" className="justify-start h-auto py-3 px-4 text-left text-sm whitespace-normal">
              Show overdue tasks
            </Button>
          </div>
        </div>
        <div className="p-4 border-t border-slate-200 bg-slate-50/50">
          <div className="relative flex items-center">
            <Input 
              placeholder="Ask me anything..." 
              className="pr-12 py-6 rounded-xl border-slate-200 shadow-sm focus-visible:ring-indigo-500 text-base"
            />
            <Button size="icon" className="absolute right-2 h-8 w-8 bg-indigo-600 hover:bg-indigo-700 rounded-lg">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
