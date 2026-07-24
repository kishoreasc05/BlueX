import { motion } from "motion/react";
import {
  Play,
  Globe,
  Check,
  ShieldCheck,
  CreditCard,
  Sparkles,
  Calendar,
  ThumbsUp,
  Search,
  Zap,
} from "lucide-react";
import { useLanguage, type Language } from "../hooks/use-language";

const VIDEO_MAP: Record<string, string> = {
  en: "https://www.youtube.com/embed/2DgEPv2O4_w",
  de: "https://www.youtube.com/embed/zvedPbv5mcQ",
  fr: "https://www.youtube.com/embed/231sEYyFYOA",
  it: "https://www.youtube.com/embed/y0iE7WcPWOY",
  pt: "https://www.youtube.com/embed/i2dlmFCZtEs",
  sq: "https://www.youtube.com/embed/xQi8pZnPipw",
  sr: "https://www.youtube.com/embed/KOeDG1zprXc",
};

interface LanguageOption {
  code: Language;
  flag: string;
  icon: React.ComponentType<any>;
  title: string;
  desc: string;
}

const videoLanguages: LanguageOption[] = [
  {
    code: "en",
    flag: "🇬🇧",
    icon: ShieldCheck,
    title: "Vetted Professionals",
    desc: "Hire verified Swiss tradespeople with absolute confidence and insurance.",
  },
  {
    code: "de",
    flag: "🇩🇪",
    icon: CreditCard,
    title: "Secure escrow payment",
    desc: "Ihr Geld wird sicher verwahrt und erst nach erfolgreicher Arbeit freigegeben.",
  },
  {
    code: "fr",
    flag: "🇫🇷",
    icon: Sparkles,
    title: "Qualité Suisse Garantie",
    desc: "Des électriciens et plombiers agréés et assurés proches de chez vous.",
  },
  {
    code: "it",
    flag: "🇮🇹",
    icon: Calendar,
    title: "Prenotazioni Facili",
    desc: "Trova e riserva un professionista in pochi passaggi con tariffe chiare.",
  },
  {
    code: "pt",
    flag: "🇵🇹",
    icon: ThumbsUp,
    title: "Satisfação Garantida",
    desc: "Serviço de alta qualidade ou fazemos os ajustes necessários bezügliche.",
  },
  {
    code: "sq",
    flag: "🇦🇱",
    icon: Search,
    title: "Zgjidhje Profesionale",
    desc: "Krahaso profilet, vlerësimet dhe rezervoni mjeshtrin më të përshtatshëm.",
  },
  {
    code: "sr",
    flag: "🇷🇸",
    icon: Zap,
    title: "Završite Posao Odmah",
    desc: "Zakažite termin i prepustite posao našim iskusnim i proverenim majstorima.",
  },
];

export default function VideoSection() {
  const { t, language, setLanguage } = useLanguage();

  // If the active language is Spanish ("es") which has no video, we default the preview to English ("en")
  const activeVideoLang = VIDEO_MAP[language] ? language : "en";
  const embedUrl = VIDEO_MAP[activeVideoLang];

  // Robustly handle flat vs nested translation keys
  const sectionTitle =
    t("videoSection.title") !== "videoSection.title"
      ? t("videoSection.title")
      : t("landingNew.videoSection.title") !== "landingNew.videoSection.title"
        ? t("landingNew.videoSection.title")
        : "What success on BlueX looks like";

  const sectionSubtitle =
    t("videoSection.subtitle") !== "videoSection.subtitle"
      ? t("videoSection.subtitle")
      : t("landingNew.videoSection.subtitle") !== "landingNew.videoSection.subtitle"
        ? t("landingNew.videoSection.subtitle")
        : "Watch how clients and trade professionals get work done across Switzerland.";

  return (
    <section className="w-full bg-white pt-20 pb-16 md:pt-28 md:pb-24 px-6 font-sans relative z-20 border-t border-zinc-150 overflow-hidden">
      <div className="max-w-[1000px] mx-auto flex flex-col items-center">
        {/* Modern Capped Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 bg-blue-50/70 border border-blue-100 px-3.5 py-1 rounded-full shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#2563eb] animate-pulse shrink-0" />
            <span className="text-[#2563eb] text-[10px] font-black uppercase tracking-[0.25em] leading-none mt-[1px]">
              {t("nav.reviews") ? t("nav.reviews").toUpperCase() : "SUCCESS STORIES"}
            </span>
          </div>
        </div>

        {/* Title */}
        <h2 className="pt-2 text-2xl md:text-3xl font-extrabold text-zinc-900 leading-[1.3] mb-3 tracking-tight text-center max-w-[800px]">
          {sectionTitle.includes("BlueX") ? (
            <>
              {sectionTitle.split("BlueX")[0]}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-black px-0.5">
                BlueX
              </span>
              {sectionTitle.split("BlueX")[1]}
            </>
          ) : (
            sectionTitle
          )}
        </h2>

        {/* Subtitle */}
        <p className="text-zinc-550 text-xs md:text-sm font-semibold mb-12 max-w-[550px] leading-relaxed text-center font-sans">
          {sectionSubtitle}
        </p>

        {/* Content Layout */}
        <div className="w-full flex flex-col lg:flex-row items-start gap-10 lg:gap-16">
          {/* Left Column: Language selector list (Desktop) or carousel (Mobile) */}
          <div className="w-full lg:w-4/12 flex flex-col justify-start shrink-0">
            {/* Desktop Language Selector List */}
            <div className="hidden lg:flex flex-col gap-1.5 w-full">
              {videoLanguages.map((lang) => {
                const isActive = activeVideoLang === lang.code;
                const Icon = lang.icon;

                return (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`group w-full py-1.5 px-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-blue-50/50 border-blue-200/80 shadow-sm ring-1 ring-blue-100"
                        : "bg-white border-zinc-150 hover:bg-zinc-50/50 hover:border-zinc-200"
                    }`}
                  >
                    {/* Left Icon/Flag Badge */}
                    <div className="relative shrink-0">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 ${
                          isActive
                            ? "bg-blue-100/60 border-blue-200 text-[#2563eb]"
                            : "bg-zinc-50 border-zinc-200/80 text-zinc-450"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 stroke-[2]" />
                      </div>
                      {/* Flag Emblem Badge */}
                      <span className="absolute -bottom-0.5 -right-0.5 text-[10px] bg-white rounded-full w-4 h-4 flex items-center justify-center shadow-sm border border-zinc-150 select-none">
                        {lang.flag}
                      </span>
                    </div>

                    {/* Content (Title Only - Descriptions Removed for Compact Layout) */}
                    <div className="flex-grow flex flex-col min-w-0 text-left">
                      <span
                        className={`text-[11px] font-black transition-colors duration-200 leading-none ${
                          isActive ? "text-[#2563eb]" : "text-zinc-800"
                        }`}
                      >
                        {lang.title}
                      </span>
                    </div>

                    {/* Right Check/Play Badge */}
                    <div
                      className={`w-4.5 h-4.5 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
                        isActive
                          ? "bg-[#14a800] text-white scale-100 shadow-sm"
                          : "border border-zinc-200 text-transparent scale-90 group-hover:border-zinc-300"
                      }`}
                    >
                      {isActive ? (
                        <Check className="w-2 h-2 stroke-[3.5]" />
                      ) : (
                        <Play className="w-1.5 h-1.5 text-zinc-450 fill-current opacity-0 group-hover:opacity-100 transition-opacity ml-0.5" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Mobile Language Selector: Horizontal scroll chips */}
            <div className="flex lg:hidden overflow-x-auto pb-4 gap-2.5 -mx-6 px-6 scrollbar-none w-[calc(100%+3rem)]">
              {videoLanguages.map((lang) => {
                const isActive = activeVideoLang === lang.code;

                return (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-xs font-bold shrink-0 transition-all duration-300 cursor-pointer shadow-sm ${
                      isActive
                        ? "bg-[#2563eb] border-[#2563eb] text-white"
                        : "bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300"
                    }`}
                  >
                    <span className="text-base leading-none select-none">{lang.flag}</span>
                    <span>{lang.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Video Showcase Player Container */}
          <div className="w-full lg:w-8/12 flex flex-col justify-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full aspect-video bg-black border border-zinc-150 rounded-2xl overflow-hidden shadow-xl relative"
            >
              <iframe
                key={embedUrl} // Forces reload on language change to display correct video
                src={`${embedUrl}?autoplay=0&rel=0&modestbranding=1`}
                title="BlueX Customer Success Story"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-none"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
