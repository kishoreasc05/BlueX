import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Search,
  MapPin,
  Star,
  Shield,
  ArrowRight,
  Zap,
  Droplet,
  Sparkles,
  Leaf,
  Paintbrush,
  Hammer,
  Truck,
  Heart,
  SlidersHorizontal,
  ChevronDown,
  Calendar,
  AlertTriangle,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/kpi-card";
import { getRouteApi } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const routeApi = getRouteApi("/_authenticated/client/search");

/* ── Category Configuration matching reference image pills ── */
const CATEGORY_TABS = [
  { name: "All Services", slug: null, icon: null },
  { name: "Plumbing", slug: "plumber", icon: Droplet, color: "text-blue-500" },
  { name: "Electrical", slug: "electrician", icon: Zap, color: "text-amber-500" },
  { name: "Cleaning", slug: "cleaner", icon: Sparkles, color: "text-sky-500" },
  { name: "Gardening", slug: "gardener", icon: Leaf, color: "text-emerald-500" },
];

/* ═══════════════════════════════════════════════════════
   REAL INTERACTIVE LEAFLET MAP COMPONENT
   ═══════════════════════════════════════════════════════ */
function RealMap({ providers }: { providers: any[] }) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    // 1. Inject Leaflet CSS if not already present
    const cssId = "leaflet-css-cdn";
    if (!document.getElementById(cssId)) {
      const link = document.createElement("link");
      link.id = cssId;
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // 2. Setup initialization callback
    const initMap = () => {
      const L = (window as any).L;
      if (!L || !mapContainerRef.current) return;

      if (!mapRef.current) {
        // Center on Zurich
        mapRef.current = L.map(mapContainerRef.current, {
          zoomControl: false,
          scrollWheelZoom: true,
        }).setView([47.3769, 8.5417], 13);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapRef.current);

        L.control.zoom({ position: "topright" }).addTo(mapRef.current);
      }

      // Clear existing markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      // Add marker pins for loaded providers
      providers.forEach((prov, idx) => {
        // Create deterministic slight offset from Zurich center based on provider ID
        // to distribute markers cleanly on the map
        let hash = 0;
        const idStr = String(prov.id);
        for (let i = 0; i < idStr.length; i++) {
          hash = idStr.charCodeAt(i) + ((hash << 5) - hash);
        }
        const latOffset = ((hash & 0xff) / 255 - 0.5) * 0.03;
        const lngOffset = (((hash >> 8) & 0xff) / 255 - 0.5) * 0.03;

        const lat = 47.3769 + latOffset;
        const lng = 8.5417 + lngOffset;

        const popupContent = `
          <div style="font-family: sans-serif; font-size: 12px; padding: 2px;">
            <b style="font-size: 13px; color: #0f172a;">${prov.name}</b><br/>
            <span style="color: #4f46e5; font-weight: 600;">${prov.specialty || "Contractor"}</span><br/>
            <span style="font-weight: 700; display: inline-block; margin-top: 4px;">CHF ${Number(prov.hourly_rate || 95).toFixed(0)}/hr</span>
          </div>
        `;

        const marker = L.marker([lat, lng]).addTo(mapRef.current).bindPopup(popupContent);

        markersRef.current.push(marker);
      });
    };

    // 3. Inject Leaflet JS if not already present
    const jsId = "leaflet-js-cdn";
    if (!(window as any).L) {
      const script = document.createElement("script");
      script.id = jsId;
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [providers]);

  return (
    <div ref={mapContainerRef} className="w-full h-full rounded-xl z-0 border border-slate-200" />
  );
}

/* ═══════════════════════════════════════════════════════
   SEARCH PAGE COMPONENT — Real Data & Real Map View
   ═══════════════════════════════════════════════════════ */
export function SearchPage() {
  const { q } = routeApi.useSearch();
  const [searchTerm, setSearchTerm] = useState(q || "");
  const [whereTerm, setWhereTerm] = useState("Zurich, Switzerland");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(q || null);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // Query Real Providers (Contractors) from DB
  const { data: providers, isLoading } = useQuery({
    queryKey: ["searchProviders", selectedCategory, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from("contractors")
        .select(
          `
          id, 
          name, 
          specialty, 
          hourly_rate, 
          notes,
          status
        `,
        )
        .eq("status", "active");

      if (selectedCategory) {
        query = query.ilike("specialty", `%${selectedCategory}%`);
      }
      if (searchTerm) {
        query = query.ilike("name", `%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  // Toggle favorite helper
  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const totalResults = providers?.length || 0;
  const resultNoun = selectedCategory === "plumber" ? "plumbers" : "professionals";

  return (
    <div className="space-y-6 pb-12 max-w-[1400px] mx-auto text-slate-800">
      {/* ── 1. BREADCRUMBS & HEADER ── */}
      <div className="flex flex-col gap-1.5">
        <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
          <span>Dashboard</span>
          <ChevronDown className="h-3 w-3 -rotate-90 text-slate-300" />
          <span className="text-slate-600">Find Services</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
          Find Services
        </h1>
        <p className="text-slate-500 text-sm">Discover trusted professionals near you.</p>
      </div>

      {/* ── 2. SEARCH BAR CARD ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-5">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-3 md:gap-4 items-end">
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
              What service do you need?
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Where?</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={whereTerm}
                onChange={(e) => setWhereTerm(e.target.value)}
                className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">When?</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Select date"
                className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <Button className="h-10 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-600/20">
            Search
          </Button>
        </div>
      </div>

      {/* ── 3. CATEGORY PILLS ── */}
      <div className="flex flex-wrap items-center gap-2">
        {CATEGORY_TABS.map((tab) => {
          const isSelected = selectedCategory === tab.slug;
          const Icon = tab.icon;
          return (
            <button
              key={tab.name}
              onClick={() => setSelectedCategory(tab.slug)}
              className={cn(
                "flex items-center gap-1.5 px-4.5 py-2 rounded-full border text-xs font-semibold transition-all cursor-pointer",
                isSelected
                  ? "bg-blue-50 border-blue-200 text-blue-600 shadow-sm"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50",
              )}
            >
              {Icon && <Icon className={cn("h-3.5 w-3.5", tab.color)} />}
              {tab.name}
            </button>
          );
        })}
        <button className="flex items-center gap-1 px-4.5 py-2 rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50">
          More <ChevronDown className="h-3 w-3 text-slate-400" />
        </button>
      </div>

      {/* ── 4. FILTER DROPDOWNS ── */}
      <div className="flex flex-wrap items-center gap-3">
        {[
          { label: "Sort by", value: "Recommended" },
          { label: "Price Range", value: "Any Price" },
          { label: "Rating", value: "4.0+" },
          { label: "Availability", value: "Any Time" },
        ].map((filter) => (
          <button
            key={filter.label}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <span className="text-slate-400">{filter.label}</span>
            <span className="text-slate-800">{filter.value}</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>
        ))}
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors ml-auto cursor-pointer">
          <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
          Filters
        </button>
      </div>

      {/* ── 5. CONTENT GRID (List + Sidebar) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* LEFT COLUMN: List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold text-slate-900">
              {totalResults} {resultNoun} found
            </div>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory(null);
              }}
              className="text-xs text-blue-600 font-semibold hover:text-blue-700"
            >
              Clear all
            </button>
          </div>

          {/* List of cards */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="py-20 text-center text-sm text-slate-500">
                Searching for providers...
              </div>
            ) : !providers || providers.length === 0 ? (
              <EmptyState
                title="No service providers found"
                description="We couldn't find any active contractors matching your query in the database. Open the Provider portal to register contractors."
                icon={Search}
              />
            ) : (
              providers.map((p) => {
                const isFav = !!favorites[p.id];
                const avatarSeed = p.name.replace(/\s+/g, "").toLowerCase();
                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-5 flex flex-col md:flex-row gap-4 relative hover:border-blue-200 transition-colors"
                  >
                    {/* Photo */}
                    <div className="h-24 w-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0 relative mx-auto md:mx-0">
                      <img
                        src={`https://i.pravatar.cc/150?u=${avatarSeed}`}
                        alt={p.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Main Details */}
                    <div className="flex-1 space-y-1.5 text-center md:text-left">
                      <div className="flex flex-col md:flex-row md:items-center gap-1.5 justify-center md:justify-start">
                        <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5 justify-center md:justify-start">
                          {p.name}
                          <BadgeCheck className="h-4 w-4 text-blue-500 fill-blue-500/10" />
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 font-semibold">
                        {p.specialty || "Contractor"}
                      </div>

                      {/* Notes / Description */}
                      {p.notes && (
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                          {p.notes}
                        </p>
                      )}

                      {/* Quick credentials badges */}
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1 text-[11px] text-slate-500 font-medium">
                        <span className="flex items-center gap-1">💼 Swiss Certified</span>
                        <span className="flex items-center gap-1 text-blue-600">✓ Verified</span>
                        <span className="flex items-center gap-1 text-emerald-600">🛡️ Insured</span>
                      </div>
                    </div>

                    {/* Price & Actions on the Right */}
                    <div className="flex flex-col items-center md:items-end justify-between gap-3 md:gap-0 shrink-0 text-center md:text-right md:pl-4 md:border-l border-slate-100">
                      {/* Price */}
                      <div>
                        <div className="text-lg font-black text-slate-900 leading-tight">
                          CHF {p.hourly_rate ? Number(p.hourly_rate).toFixed(0) : "95"}
                        </div>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">
                          per hour
                        </div>
                        <span className="inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded border uppercase bg-emerald-50 text-emerald-600 border-emerald-100">
                          Available Today
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-col gap-2 w-full sm:w-auto md:w-36">
                        <button className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-sm cursor-pointer">
                          View Profile
                        </button>
                        <button className="h-9 px-4 rounded-xl border border-blue-200 bg-white hover:bg-blue-50 text-blue-600 text-xs font-semibold transition-colors cursor-pointer">
                          Book Now
                        </button>
                      </div>
                    </div>

                    {/* Favorite Toggle button */}
                    <button
                      onClick={() => toggleFavorite(p.id)}
                      className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-slate-50 transition-colors"
                    >
                      <Heart
                        className={cn(
                          "h-4.5 w-4.5 transition-colors",
                          isFav ? "text-red-500 fill-red-500" : "text-slate-300",
                        )}
                      />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar Widgets */}
        <div className="space-y-5">
          {/* Map View Widget */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4.5">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-sm font-bold text-slate-900">Map View</h3>
              <button className="text-blue-600 text-xs font-semibold hover:text-blue-700">
                View larger map
              </button>
            </div>
            {/* Real OSM Map Widget */}
            <div className="h-72 bg-slate-50 rounded-xl overflow-hidden relative">
              <RealMap providers={providers || []} />
            </div>
          </div>

          {/* Why choose BlueX.ch */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Why choose BlueX.ch?</h3>
            <div className="space-y-4">
              {[
                {
                  icon: BadgeCheck,
                  title: "Verified Professionals",
                  desc: "All professionals are background checked",
                  color: "text-blue-500",
                  bg: "bg-blue-50",
                },
                {
                  icon: Shield,
                  title: "Secure Payments",
                  desc: "Your payments are safe and protected",
                  color: "text-emerald-500",
                  bg: "bg-emerald-50",
                },
                {
                  icon: Star,
                  title: "Satisfaction Guarantee",
                  desc: "We're here to make it right",
                  color: "text-violet-500",
                  bg: "bg-violet-50",
                },
                {
                  icon: Headphones,
                  title: "24/7 Customer Support",
                  desc: "Get help anytime you need it",
                  color: "text-amber-500",
                  bg: "bg-amber-50",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-3">
                  <div
                    className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                      item.bg,
                    )}
                  >
                    <item.icon className={cn("h-4.5 w-4.5", item.color)} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">{item.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Service Banner */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 relative overflow-hidden">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <h3 className="text-sm font-bold text-slate-900">Need it urgently?</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Our emergency service is available 24/7
                </p>
                <button className="mt-3 flex items-center gap-1.5 text-red-600 text-xs font-bold px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 transition-colors cursor-pointer">
                  <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                  Emergency Service
                </button>
              </div>
              {/* Pulsing Siren Icon */}
              <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center relative shrink-0">
                <span className="absolute inset-0 rounded-full bg-red-400/25 animate-ping" />
                <AlertTriangle className="h-8 w-8 text-red-500 relative z-10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple Headphones icon alias
function Headphones(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  );
}
