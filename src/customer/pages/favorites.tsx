import { useState } from "react";
import { Heart, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";

const INITIAL_FAVORITES = [
  {
    id: "clean-shine",
    name: "Clean & Shine",
    specialty: "House Cleaning Service",
    rating: 4.9,
    reviewsCount: 128,
    hourlyRate: 45,
    avatar:
      "https://images.unsplash.com/photo-1581579438747-1dc8d1e0ca96?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: "sparkle-home",
    name: "Sparkle Home Services",
    specialty: "House Cleaning Service",
    rating: 4.8,
    reviewsCount: 96,
    hourlyRate: 40,
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
  },
];

export function ClientFavoritesPage() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState(INITIAL_FAVORITES);

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6 pb-12 max-w-[1400px] mx-auto text-slate-800">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Heart className="h-6 w-6 text-red-500 fill-red-500/10" />
          Saved Providers
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Quickly access and book your favorite verified professionals.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-12 text-center max-w-md mx-auto space-y-4">
          <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center mx-auto text-red-500">
            <Heart className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900">No saved providers</h3>
            <p className="text-xs text-slate-400">
              Tap the heart icon on any provider's card to save them here.
            </p>
          </div>
          <Button
            onClick={() => navigate({ to: "/client/search" })}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs px-5"
          >
            Find Services
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {favorites.map((prov) => (
            <div
              key={prov.id}
              className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4 flex flex-col justify-between hover:border-blue-200 transition-all relative"
            >
              <button
                onClick={() => removeFavorite(prov.id)}
                className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-slate-50 text-red-500"
              >
                <Heart className="h-4.5 w-4.5 fill-current" />
              </button>

              <div className="flex gap-3">
                <div className="h-12 w-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  <img src={prov.avatar} alt={prov.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">{prov.name}</h3>
                  <span className="text-[10px] text-slate-400 font-semibold block">
                    {prov.specialty}
                  </span>

                  {prov.rating ? (
                    <div className="flex items-center gap-1 mt-1 text-amber-500">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="text-[10px] font-bold text-slate-800">{prov.rating}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({prov.reviewsCount})
                      </span>
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-400 mt-1 font-semibold">
                      New Provider
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-4">
                <span className="text-xs font-bold text-slate-800">CHF {prov.hourlyRate}/hr</span>
                <Button
                  onClick={() => navigate({ to: `/client/providers/${prov.id}` as any })}
                  variant="ghost"
                  className="h-8 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2.5 rounded-lg cursor-pointer"
                >
                  View Profile <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
