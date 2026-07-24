import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ChevronRight,
  BookOpen,
  MapPin,
  Send,
  ChevronDown,
  ArrowLeft,
  Mail,
  Phone,
  Clock,
} from "lucide-react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { getLocalizedPageContent } from "./contentData";
import { useLanguage } from "../../hooks/use-language";
import { toast } from "sonner";

interface FooterPageLayoutProps {
  pageId: string;
}

interface GroupLink {
  id: string;
  name: string;
}

interface NavGroup {
  title: string;
  links: GroupLink[];
}

export default function FooterPageLayout({ pageId }: FooterPageLayoutProps) {
  const { language, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Contact Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pageContent = getLocalizedPageContent(pageId, language);

  const navGroups: NavGroup[] = [
    {
      title: "For Customers",
      links: [
        { id: "how-it-works", name: "How It Works" },
        { id: "browse-services", name: "Browse Services" },
        { id: "trust-security", name: "Trust & Security" },
        { id: "help-center", name: "Help Center" },
      ],
    },
    {
      title: "For Professionals",
      links: [
        { id: "become-provider", name: "Become a Provider" },
        { id: "provider-resources", name: "Provider Resources" },
        { id: "success-stories", name: "Success Stories" },
        { id: "community", name: "Community" },
      ],
    },
    {
      title: "Company",
      links: [
        { id: "about-us", name: "About Us" },
        { id: "careers", name: "Careers" },
        { id: "blog", name: "Blog" },
        { id: "contact-us", name: "Contact Us" },
      ],
    },
    {
      title: "Legal",
      links: [
        { id: "terms-of-service", name: "Terms of Service" },
        { id: "privacy-policy", name: "Privacy Policy" },
        { id: "cookie-policy", name: "Cookie Policy" },
        { id: "imprint", name: "Imprint" },
      ],
    },
  ];

  // Helper to translate nav link names based on language
  const getNavLabel = (id: string, defaultName: string) => {
    switch (id) {
      case "how-it-works":
        return t("landingNew.howItWorks") || defaultName;
      case "browse-services":
        return t("nav.services") || defaultName;
      case "trust-security":
        return t("nav.trust") || defaultName;
      case "become-provider":
        return t("nav.becomeProvider") || defaultName;
      case "about-us":
        return t("footer.about") || defaultName;
      case "terms-of-service":
        return t("footer.terms") || defaultName;
      case "privacy-policy":
        return t("footer.privacy") || defaultName;
      case "cookie-policy":
        return t("footer.cookie") || defaultName;
      case "imprint":
        return t("footer.imprint") || defaultName;
      default:
        return defaultName;
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API request
    setTimeout(() => {
      toast.success(
        language === "de"
          ? "Nachricht erfolgreich gesendet! Wir werden uns in Kürze bei Ihnen melden."
          : "Message sent successfully! We will get back to you shortly.",
      );
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1200);
  };

  if (!pageContent) {
    return (
      <div className="min-h-screen w-full flex flex-col justify-between bg-zinc-50 font-sans">
        <Navbar />
        <div className="pt-32 pb-16 flex flex-col items-center justify-center flex-grow">
          <h1 className="text-2xl font-bold text-zinc-800">Page content not found</h1>
          <Link
            to="/"
            className="mt-4 text-[#2563eb] font-bold hover:underline flex items-center gap-1.5 text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Go Back Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Find active link name for mobile selector
  const activeLinkName =
    navGroups.flatMap((g) => g.links).find((l) => l.id === pageId)?.name || pageContent.title;

  return (
    <div className="min-h-screen w-full flex flex-col bg-zinc-50 font-sans text-zinc-800 overflow-x-hidden">
      {/* Dynamic Header Space for Navbar */}
      <Navbar />

      {/* Hero Banner Header */}
      <div className="w-full bg-[#030712] text-white pt-32 pb-16 px-6 relative z-10 border-b border-white/5">
        <div className="max-w-[1200px] mx-auto text-left">
          <Link
            to="/"
            className="text-zinc-400 hover:text-white transition-colors text-xs font-bold flex items-center gap-1.5 mb-6 w-fit"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
            {pageContent.title}
          </h1>
          <p className="text-zinc-450 text-sm font-semibold max-w-[600px] leading-relaxed">
            {pageContent.subtitle}
          </p>
        </div>
      </div>

      {/* Mobile Sidebar Selector Dropdown */}
      <div className="w-full bg-white border-b border-zinc-200 py-3.5 px-6 lg:hidden relative z-30">
        <div className="max-w-[1200px] mx-auto">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700"
          >
            <span>{getNavLabel(pageId, activeLinkName)}</span>
            <ChevronDown
              className={`w-4 h-4 text-zinc-500 transition-transform duration-300 ${mobileMenuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {mobileMenuOpen && (
            <div className="absolute left-6 right-6 mt-2 bg-white border border-zinc-200 rounded-xl shadow-xl p-4 flex flex-col gap-4 max-h-[300px] overflow-y-auto">
              {navGroups.map((group) => (
                <div key={group.title} className="flex flex-col gap-1">
                  <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider mb-1 px-2">
                    {group.title}
                  </span>
                  {group.links.map((link) => (
                    <Link
                      key={link.id}
                      to="/$pageId"
                      params={{ pageId: link.id }}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-xs font-bold px-2 py-1.5 rounded-lg transition-colors ${
                        pageId === link.id
                          ? "bg-blue-50 text-[#2563eb]"
                          : "text-zinc-650 hover:bg-zinc-50"
                      }`}
                    >
                      {getNavLabel(link.id, link.name)}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Page Layout Grid */}
      <div className="max-w-[1200px] mx-auto w-full px-6 py-12 md:py-16 flex-grow">
        <div className="flex flex-col lg:flex-row gap-12 items-start w-full">
          {/* Left Column: Sidebar Navigation (Desktop) */}
          <aside className="w-full lg:w-1/4 shrink-0 hidden lg:flex flex-col gap-8 sticky top-28">
            {navGroups.map((group) => (
              <div key={group.title} className="flex flex-col gap-2">
                <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em] mb-1">
                  {group.title}
                </h4>
                <nav className="flex flex-col gap-1 border-l border-zinc-200 pl-0.5">
                  {group.links.map((link) => {
                    const isLinkActive = pageId === link.id;
                    return (
                      <Link
                        key={link.id}
                        to="/$pageId"
                        params={{ pageId: link.id }}
                        className={`text-[12px] font-bold py-1.5 pl-3 border-l -ml-px flex items-center justify-between group transition-all ${
                          isLinkActive
                            ? "border-[#2563eb] text-[#2563eb] font-extrabold"
                            : "border-transparent text-zinc-550 hover:text-zinc-900 hover:border-zinc-300"
                        }`}
                      >
                        <span>{getNavLabel(link.id, link.name)}</span>
                        <ChevronRight
                          className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${isLinkActive ? "opacity-100 text-[#2563eb]" : "text-zinc-400"}`}
                        />
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </aside>

          {/* Right Column: Content Block */}
          <main className="w-full lg:w-3/4 bg-white border border-zinc-200/80 rounded-3xl p-6 md:p-10 shadow-sm text-left flex flex-col justify-start">
            <span className="text-[10px] text-zinc-400 font-bold self-end mb-6 uppercase tracking-wider">
              {language === "de" ? "Letzte Aktualisierung:" : "Last Updated:"}{" "}
              {pageContent.lastUpdated}
            </span>

            {/* Render dynamically defined sections */}
            <div className="flex flex-col gap-8 leading-relaxed text-zinc-650 text-sm font-semibold">
              {pageContent.sections.map((section, idx) => (
                <div key={idx} className="flex flex-col gap-3">
                  <h2 className="text-lg md:text-xl font-extrabold text-zinc-900 tracking-tight">
                    {section.title}
                  </h2>
                  {section.text && <p className="leading-relaxed">{section.text}</p>}
                  {section.bullets && (
                    <ul className="space-y-2 mt-2">
                      {section.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb] mt-2 shrink-0" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* Special Contact Us Form Integration */}
            {pageId === "contact-us" && (
              <div className="mt-12 pt-8 border-t border-zinc-150 w-full">
                <h2 className="text-xl font-extrabold text-zinc-900 mb-6">
                  {language === "de" ? "Schreiben Sie uns direkt" : "Send Us a Message"}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  <form
                    onSubmit={handleContactSubmit}
                    className="md:col-span-7 flex flex-col gap-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-zinc-500 uppercase">
                          {language === "de" ? "Ihr Name" : "Your Name"}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="px-3.5 py-2 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]/20 bg-zinc-50/50 font-bold"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-zinc-500 uppercase">
                          {language === "de" ? "Ihre E-Mail" : "Your Email"}
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="px-3.5 py-2 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]/20 bg-zinc-50/50 font-bold"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-zinc-500 uppercase">
                        {language === "de" ? "Betreff" : "Subject"}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="px-3.5 py-2 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]/20 bg-zinc-50/50 font-bold"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-zinc-500 uppercase">
                        {language === "de" ? "Nachricht" : "Message"}
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="px-3.5 py-2 text-xs border border-zinc-200 rounded-xl focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]/20 bg-zinc-50/50 font-bold resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="mt-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold px-6 h-10 rounded-xl flex items-center justify-center gap-2 self-start transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>
                        {isSubmitting
                          ? language === "de"
                            ? "Wird gesendet..."
                            : "Sending..."
                          : language === "de"
                            ? "Nachricht Senden"
                            : "Send Message"}
                      </span>
                    </button>
                  </form>

                  {/* Sidebar Help / Address Details */}
                  <div className="md:col-span-5 bg-zinc-50 border border-zinc-200 rounded-2xl p-5 flex flex-col gap-5">
                    <h3 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider">
                      {language === "de" ? "Direktkontakt" : "Direct Contact"}
                    </h3>

                    <div className="flex flex-col gap-4 text-xs font-semibold text-zinc-650">
                      <div className="flex items-start gap-3">
                        <Mail className="w-4 h-4 text-[#2563eb] shrink-0 mt-0.5" />
                        <div className="flex flex-col">
                          <span className="text-zinc-400 text-[10px] uppercase font-bold">
                            Email
                          </span>
                          <span className="font-extrabold text-zinc-800">support@bluex.ch</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone className="w-4 h-4 text-[#2563eb] shrink-0 mt-0.5" />
                        <div className="flex flex-col">
                          <span className="text-zinc-400 text-[10px] uppercase font-bold">
                            Phone
                          </span>
                          <span className="font-extrabold text-zinc-800">+41 44 123 45 67</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="w-4 h-4 text-[#2563eb] shrink-0 mt-0.5" />
                        <div className="flex flex-col">
                          <span className="text-zinc-400 text-[10px] uppercase font-bold">
                            Support Hours
                          </span>
                          <span className="font-extrabold text-zinc-800">24/7 Available</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 border-t border-zinc-200/80 pt-4">
                        <MapPin className="w-4 h-4 text-[#2563eb] shrink-0 mt-0.5" />
                        <div className="flex flex-col">
                          <span className="text-zinc-400 text-[10px] uppercase font-bold">
                            Headquarters
                          </span>
                          <span className="font-bold text-zinc-800 leading-snug">
                            BlueX AG
                            <br />
                            Bahnhofstrasse 100
                            <br />
                            8001 Zürich, Switzerland
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
