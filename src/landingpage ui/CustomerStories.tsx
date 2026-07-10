import { motion } from "motion/react";
import { Star } from "lucide-react";
import { useLanguage } from "../hooks/use-language";

export default function CustomerStories() {
  const { t } = useLanguage();

  const reviews = [
    {
      name: "Sarah M.",
      location: "Zurich",
      review: "Found a verified electrician within 15 minutes. Secure payments through escrow gave me complete peace of mind.",
      initials: "SM",
    },
    {
      name: "Marc K.",
      location: "Bern",
      review: "Very easy to book local trade professionals. All credentials and UID checks are already verified by BlueX.",
      initials: "MK",
    },
    {
      name: "Eleni S.",
      location: "Geneva",
      review: "Highly recommend for anyone looking for reliable blue-collar services. The pricing is transparent and fair.",
      initials: "ES",
    },
  ];

  return (
    <section
      id="stories"
      className="w-full py-16 px-6 bg-zinc-50 border-t border-zinc-200 relative z-20 font-sans"
    >
      <div className="max-w-[1200px] mx-auto text-center">
        <h3 className="text-sm font-bold tracking-wider uppercase text-[#14a800] mb-2">
          {t("stories.badge") || "Testimonials"}
        </h3>
        <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-8 tracking-tight font-sans">
          Trusted by thousands of Swiss homeowners &amp; pros
        </h2>

        {/* Small horizontal testimonial grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {reviews.map((rev, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm flex items-start gap-4 hover:border-[#14a800] hover:shadow-md transition-all duration-300 text-left"
            >
              <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center text-[#14a800] font-bold text-xs shrink-0 border border-green-100 font-sans">
                {rev.initials}
              </div>
              <div className="flex-grow font-sans">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-zinc-800">{rev.name} — {rev.location}</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed font-semibold">
                  "{rev.review}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
