import { Facebook, Twitter, Linkedin, Github } from "lucide-react";
import { useLanguage } from "../hooks/use-language";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-[#05030a] pt-32 pb-12 px-6 relative z-20 font-sans border-t border-white/5 overflow-hidden">
      {/* Background Grid & Violet Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px]" />

        {/* Giant Violet Blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-violet-600/10 blur-[120px] rounded-[100%] pointer-events-none" />

        {/* Secondary Indigo Blob */}
        <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
      </div>

      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-20">
          {/* Brand & Tagline */}
          <div className="flex flex-col gap-6 lg:col-span-2 text-left">
            <a
              href="#"
              className="flex items-center gap-2 text-white font-semibold text-3xl tracking-tight font-display mb-2 drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]"
            >
              ✦ BlueX
            </a>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-[320px]">
              {t("footer.desc")}
            </p>
          </div>

          {/* Services Column */}
          <div className="flex flex-col gap-4 text-left">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider">
              {t("footer.product")}
            </h4>
            <ul className="space-y-2 text-zinc-400 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("categories.electrical")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("categories.plumbing")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("categories.cleaning")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("categories.gardening")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("categories.painting")}
                </a>
              </li>
            </ul>
          </div>

          {/* Business Column */}
          <div className="flex flex-col gap-4 text-left">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider">
              {t("footer.company")}
            </h4>
            <ul className="space-y-2 text-zinc-400 text-sm">
              <li>
                <a
                  href="/signin?mode=signup&role=provider"
                  className="hover:text-white transition-colors"
                >
                  {t("nav.becomeProvider")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("nav.aiCoach")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("categories.highlight4Title")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("categories.highlight1Title")}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="flex flex-col gap-4 text-left">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider">
              {t("footer.legal")}
            </h4>
            <ul className="space-y-2 text-zinc-400 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer.privacy")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer.terms")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t("footer.imprint")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Socials & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 gap-6">
          <p className="text-xs text-zinc-500 font-medium">
            © {new Date().getFullYear()} BlueX Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-8 text-zinc-400">
            <a href="#" className="hover:text-violet-400 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-violet-400 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-violet-400 transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-violet-400 transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
