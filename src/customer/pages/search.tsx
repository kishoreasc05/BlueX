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
  Building,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/kpi-card";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { MOCK_PROVIDERS } from "@/customer/mockData";
import { EmergencyDialog } from "@/customer/components/emergency-dialog";
import { AiMatchPage } from "./ai-match";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
   INTERACTIVE MAP MODAL WITH 1KM RANGE RADIUS FILTER
   ═══════════════════════════════════════════════════════ */
function InteractiveMapModal({
  open,
  onOpenChange,
  providers,
  navigate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  providers: any[];
  navigate: any;
}) {
  const [searchLoc, setSearchLoc] = useState("Zurich, Switzerland");
  const [center, setCenter] = useState<[number, number]>([47.3769, 8.5417]);
  const [isLoading, setIsLoading] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const circleRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Function to calculate distance in km
  const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 185);
    const dLon = (lon2 - lon1) * (Math.PI / 185);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 185)) *
        Math.cos(lat2 * (Math.PI / 185)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Compute coordinates for each provider and filter those within 1km
  const providersWithCoords = providers.map((prov) => {
    let hash = 0;
    const idStr = String(prov.id);
    for (let i = 0; i < idStr.length; i++) {
      hash = idStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Determinisic coordinates offset from Zurich center
    const lat = 47.3769 + ((hash & 0xff) / 255 - 0.5) * 0.03;
    const lng = 8.5417 + (((hash >> 8) & 0xff) / 255 - 0.5) * 0.03;
    const dist = getDistanceKm(center[0], center[1], lat, lng);
    return { ...prov, lat, lng, dist };
  });

  const nearbyProviders = providersWithCoords
    .filter((p) => p.dist <= 1.0)
    .sort((a, b) => a.dist - b.dist);

  // Trigger geocoding via Nominatim
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchLoc.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
          searchLoc,
        )}`,
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const newLat = parseFloat(data[0].lat);
        const newLon = parseFloat(data[0].lon);
        setCenter([newLat, newLon]);
      } else {
        alert("Location not found. Please try another search.");
      }
    } catch (err) {
      console.error("Geocoding failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 1. Initialize map once when dialog is opened
  useEffect(() => {
    if (!open) return;

    // Inject Leaflet CSS
    const cssId = "leaflet-css-cdn";
    if (!document.getElementById(cssId)) {
      const link = document.createElement("link");
      link.id = cssId;
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const initMap = () => {
      const L = (window as any).L;
      if (!L || !mapContainerRef.current) return;

      if (!mapRef.current) {
        mapRef.current = L.map(mapContainerRef.current, {
          zoomControl: false,
          scrollWheelZoom: true,
        }).setView(center, 14);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapRef.current);

        L.control.zoom({ position: "topright" }).addTo(mapRef.current);
      }

      // Force size recalculation after modal transition ends
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
      }, 200);
    };

    // Inject Leaflet JS
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
        circleRef.current = null;
        markersRef.current = [];
      }
    };
  }, [open]);

  // 2. Update view, circle and markers whenever center or nearby providers change
  useEffect(() => {
    if (!open || !mapRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    // Update view center
    mapRef.current.setView(center, 14);

    // Draw circle
    if (circleRef.current) {
      circleRef.current.remove();
    }
    circleRef.current = L.circle(center, {
      radius: 1000,
      color: "#3b82f6",
      fillColor: "#3b82f6",
      fillOpacity: 0.12,
      weight: 1.5,
    }).addTo(mapRef.current);

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Add search center marker
    const centerIcon = L.divIcon({
      className: "bg-red-500 border-2 border-white rounded-full h-4 w-4 shadow flex items-center justify-center bg-red-650",
      html: `<div style="width: 6px; height: 6px; background: white; border-radius: 50%;"></div>`,
    });
    const centerMarker = L.marker(center, { icon: centerIcon })
      .addTo(mapRef.current)
      .bindPopup("<b>Your search center</b>");
    markersRef.current.push(centerMarker);

    // Add markers for nearby providers
    nearbyProviders.forEach((prov) => {
      const popupContent = `
        <div style="font-family: sans-serif; font-size: 11px; min-width: 140px;">
          <b style="font-size: 12px; color: #0f172a;">${prov.name}</b><br/>
          <span style="color: #3b82f6; font-weight: 600;">${
            prov.specialtyLabel || "Contractor"
          }</span><br/>
          <span style="color: #64748b;">Distance: ${(prov.dist * 1000).toFixed(0)}m</span><br/>
          <span style="font-weight: 700; display: inline-block; margin-top: 4px;">CHF ${Number(
            prov.hourlyRate,
          ).toFixed(0)}/hr</span>
        </div>
      `;

      const pin = L.marker([prov.lat, prov.lng]).addTo(mapRef.current).bindPopup(popupContent);
      markersRef.current.push(pin);
    });

    // Invalidate size once more on update
    mapRef.current.invalidateSize();
  }, [open, center, nearbyProviders]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0 overflow-hidden rounded-2xl border-slate-200">
        {/* Header Search Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 justify-between items-center bg-white shrink-0">
          <div>
            <DialogTitle className="text-base font-black text-slate-900">
              🗺️ Find Nearby Providers (1km Range)
            </DialogTitle>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
              Enter a location to find providers operating within 1 kilometer.
            </p>
          </div>
          <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto min-w-[280px]">
            <input
              type="text"
              placeholder="Enter city or address (e.g. Zurich)"
              value={searchLoc}
              onChange={(e) => setSearchLoc(e.target.value)}
              className="flex-1 h-9 px-3 rounded-xl border border-slate-200 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shrink-0 cursor-pointer"
            >
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </form>
        </div>

        {/* Split Container */}
        <div className="flex-1 min-h-0 flex flex-col md:flex-row bg-slate-50">
          {/* Leaflet Map */}
          <div className="flex-1 h-full min-h-[300px] md:min-h-0 relative">
            <div ref={mapContainerRef} className="absolute inset-0 z-0 h-full w-full" />
          </div>

          {/* Sidebar Panel of Nearby Providers */}
          <div className="w-full md:w-[320px] h-full border-t md:border-t-0 md:border-l border-slate-100 bg-white flex flex-col shrink-0 overflow-y-auto">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Results
              </span>
              <h4 className="text-xs font-black text-slate-950 mt-0.5">
                {nearbyProviders.length} Providers Found within 1km
              </h4>
            </div>

            <div className="flex-1 divide-y divide-slate-100">
              {nearbyProviders.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs space-y-2">
                  <p className="font-semibold text-slate-700">No providers found</p>
                  <p className="text-[10px]">
                    No contractors are situated within 1km of "{searchLoc}". Try another city like
                    Zurich.
                  </p>
                </div>
              ) : (
                nearbyProviders.map((prov) => (
                  <div key={prov.id} className="p-4 space-y-2.5 hover:bg-slate-50/50 transition-colors">
                    <div>
                      <div className="flex justify-between items-baseline gap-2">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {prov.name}
                        </span>
                        <span className="text-[10px] text-blue-600 font-bold shrink-0 bg-blue-50 px-1.5 py-0.5 rounded">
                          {(prov.dist * 1000).toFixed(0)}m away
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block font-semibold">
                        {prov.specialtyLabel}
                      </span>
                    </div>

                    <div className="flex justify-between items-center gap-4">
                      <span className="text-xs font-black text-slate-900">
                        CHF {Number(prov.hourlyRate).toFixed(0)}/hr
                      </span>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            if (mapRef.current) {
                              mapRef.current.setView([prov.lat, prov.lng], 16);
                            }
                          }}
                          className="h-7 px-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-[10px] font-bold text-slate-650 transition-colors cursor-pointer"
                        >
                          Locate
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onOpenChange(false);
                            navigate({ to: `/client/book/${prov.id}` as any });
                          }}
                          className="h-7 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          Book
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ═══════════════════════════════════════════════════════
   SEARCH PAGE COMPONENT — Real Data & Real Map View
   ═══════════════════════════════════════════════════════ */
export function SearchPage() {
  const navigate = useNavigate();
  const { q } = routeApi.useSearch();
  const [activeTab, setActiveTab] = useState<"search" | "aiMatch">("search");
  const [mapOpen, setMapOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(q || "");
  const [whereTerm, setWhereTerm] = useState("Zurich, Switzerland");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(q || null);
  const [providerType, setProviderType] = useState<string>("all");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  // Sync router search query with local state
  useEffect(() => {
    setSearchTerm(q || "");
    if (q) {
      const matchCategory = ["plumber", "electrician", "cleaner", "gardener"].find(
        (slug) => slug === q.toLowerCase(),
      );
      if (matchCategory) {
        setSelectedCategory(matchCategory);
      }
    } else {
      setSelectedCategory(null);
    }
  }, [q]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/client/search", search: { q: searchTerm || undefined } as any });
  };

  // Query Real Providers (Contractors) from DB with reviews and bookings to calculate real stats
  const { data: providers, isLoading } = useQuery({
    queryKey: ["searchProviders", selectedCategory, searchTerm],
    queryFn: async () => {
      const query = supabase
        .from("contractors")
        .select(
          `
          id, 
          name, 
          specialty, 
          hourly_rate, 
          notes,
          status,
          organization:organizations(
            id,
            reviews(rating),
            bookings(id, status)
          )
        `,
        )
        .eq("status", "active");

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  // Toggle favorite helper
  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Convert and merge database records with premium local mock providers
  const dbProvidersConverted = (providers || []).map((p: any) => {
    const org = p.organization;
    const reviews = org?.reviews || [];
    const bookings = org?.bookings || [];

    const rating = reviews.length > 0
      ? Number((reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1))
      : null;
    const reviewsCount = reviews.length;
    const jobsCompleted = bookings.filter((b: any) => b.status === "completed").length;
    const completionRate = bookings.length > 0
      ? `${Math.round((jobsCompleted / bookings.length) * 100)}%`
      : null;

    return {
      id: p.id,
      name: p.name,
      type: p.name.toLowerCase().includes("gmbh") ||
            p.name.toLowerCase().includes("ag") ||
            p.name.toLowerCase().includes("company")
              ? ("company" as const)
              : ("private" as const),
      specialty: (p.specialty || "").toLowerCase(),
      specialtyLabel: p.specialty || "Contractor",
      rating: rating,
      reviewsCount: reviewsCount,
      hourlyRate: Number(p.hourly_rate || 90),
      responseTime: null, // Don't show dummy mockup response time!
      completionRate: completionRate,
      jobsCompleted: jobsCompleted,
      languages: "DE, EN",
      avatar: `https://i.pravatar.cc/150?u=${p.name.replace(/\s+/g, "").toLowerCase()}`,
      about: p.notes || "Professional blue-collar service provider registered on BlueX.",
      services: [p.specialty || "General Contractor Services"],
      reviews: reviews,
      faqs: [],
    };
  });

  const allProvidersList = dbProvidersConverted;

  // Apply filters locally for rapid interactive testing
  const filteredProviders = allProvidersList.filter((p) => {
    // 1. Specialty Category filter
    if (selectedCategory) {
      // Check if provider specialty matches category slug
      if (!p.specialty.toLowerCase().includes(selectedCategory.toLowerCase())) {
        return false;
      }
    }

    // 2. Search term filter (name, notes/about, or specialty label)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesName = p.name.toLowerCase().includes(term);
      const matchesAbout = p.about.toLowerCase().includes(term);
      const matchesSpecialty = p.specialtyLabel.toLowerCase().includes(term);
      if (!matchesName && !matchesAbout && !matchesSpecialty) {
        return false;
      }
    }

    // 3. Provider Type filter (Company vs Private)
    if (providerType !== "all") {
      if (p.type !== providerType) {
        return false;
      }
    }

    return true;
  });

  const totalResults = filteredProviders.length;
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Find Services
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">Discover trusted professionals near you.</p>
          </div>

          {/* Toggle Tab buttons */}
          <div className="bg-slate-100 p-1 rounded-xl flex gap-1 border border-slate-200 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab("search")}
              className={cn(
                "px-4 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer",
                activeTab === "search"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              Search Directory
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("aiMatch")}
              className={cn(
                "px-4 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5",
                activeTab === "aiMatch"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Match
            </button>
          </div>
        </div>
      </div>

      {activeTab === "aiMatch" ? (
        <AiMatchPage />
      ) : (
        <>

      {/* ── 2. SEARCH BAR CARD ── */}
      <form
        onSubmit={handleSearchSubmit}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-5"
      >
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
          <Button
            type="submit"
            className="h-10 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-600/20"
          >
            Search
          </Button>
        </div>
      </form>

      {/* ── 3. CATEGORY PILLS ── */}
      <div className="flex flex-wrap items-center gap-2">
        {CATEGORY_TABS.map((tab) => {
          const isSelected = selectedCategory === tab.slug;
          const Icon = tab.icon;
          return (
            <button
              key={tab.name}
              onClick={() => {
                setSelectedCategory(tab.slug);
                navigate({ to: "/client/search", search: { q: tab.slug || undefined } as any });
              }}
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

        {/* Interactive Provider Type Filter */}
        <div className="relative">
          <select
            value={providerType}
            onChange={(e) => setProviderType(e.target.value)}
            className="appearance-none flex items-center gap-2 pl-4 pr-10 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">Provider Type: All</option>
            <option value="company">🏢 Companies Only</option>
            <option value="private">👤 Private Individuals Only</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        </div>

        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors ml-auto cursor-pointer">
          <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
          Filters
        </button>
      </div>

      {/* ── 5. CONTENT LIST ── */}
      <div className="space-y-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-900">
                {totalResults} {resultNoun} found
              </span>
              <button
                type="button"
                onClick={() => setMapOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/80 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                🗺️ View Map
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory(null);
                setProviderType("all");
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
            ) : !filteredProviders || filteredProviders.length === 0 ? (
              <EmptyState
                title="No service providers found"
                description="We couldn't find any active providers matching your filter criteria. Try expanding your filters or search term."
                icon={Search}
              />
            ) : (
              filteredProviders.map((p) => {
                const isFav = !!favorites[p.id];
                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-5 flex flex-col md:flex-row gap-4 relative hover:border-blue-200 transition-colors"
                  >
                    {/* Photo */}
                    <div className="h-24 w-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0 relative mx-auto md:mx-0">
                      <img src={p.avatar} alt={p.name} className="h-full w-full object-cover" />
                    </div>

                    {/* Main Details */}
                    <div className="flex-1 space-y-1.5 text-center md:text-left">
                      <div className="flex flex-col md:flex-row md:items-center gap-2 justify-center md:justify-start">
                        <span className="text-sm font-bold text-slate-900 flex items-center gap-1 justify-center md:justify-start">
                          {p.name}
                          <BadgeCheck className="h-4 w-4 text-blue-500 fill-blue-500/10" />
                        </span>

                        {/* Provider Type Badge */}
                        {p.type === "company" ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100/50 uppercase tracking-wider">
                            <Building className="h-2.5 w-2.5" /> Company
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100/50 uppercase tracking-wider">
                            <User className="h-2.5 w-2.5" /> Private
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 font-semibold">{p.specialtyLabel}</div>

                      {/* Notes / Description */}
                      {p.about && (
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                          {p.about}
                        </p>
                      )}

                      {/* Quick credentials badges */}
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1 text-[11px] text-slate-500 font-medium">
                        <span className="flex items-center gap-1">💼 Swiss Certified</span>
                        <span className="flex items-center gap-1 text-blue-600">✓ Verified</span>
                        <span className="flex items-center gap-1 text-emerald-600">🛡️ Insured</span>
                        {p.type === "private" && (
                          <span className="flex items-center gap-1 text-violet-600 font-bold">
                            ⚖️ Payroll Automated
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price & Actions on the Right */}
                    <div className="flex flex-col items-center md:items-end justify-between gap-3 md:gap-0 shrink-0 text-center md:text-right md:pl-4 md:border-l border-slate-100">
                      {/* Price */}
                      <div>
                        <div className="text-lg font-black text-slate-900 leading-tight">
                          CHF {Number(p.hourlyRate).toFixed(0)}
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
                        <button
                          onClick={() => navigate({ to: `/client/providers/${p.id}` as any })}
                          className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-sm cursor-pointer"
                        >
                          View Profile
                        </button>
                        <button
                          onClick={() => navigate({ to: `/client/book/${p.id}` as any })}
                          className="h-9 px-4 rounded-xl border border-blue-200 bg-white hover:bg-blue-50 text-blue-600 text-xs font-semibold transition-colors shadow-sm cursor-pointer"
                        >
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
      </>
      )}

      {/* ── Map Modal Dialog ── */}
      <InteractiveMapModal
        open={mapOpen}
        onOpenChange={setMapOpen}
        providers={filteredProviders}
        navigate={navigate}
      />

      <EmergencyDialog open={emergencyOpen} onOpenChange={setEmergencyOpen} />
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
