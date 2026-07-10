import { Facebook, Instagram, Linkedin, Youtube, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#030712] text-zinc-400 pt-16 pb-8 px-6 relative z-20 font-sans border-t border-white/5 overflow-hidden">
      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-4 flex flex-col items-start text-left">
            {/* Logo */}
            <a
              href="#"
              className="flex items-center gap-2 text-white font-extrabold text-2xl tracking-tight mb-4"
            >
              <span className="text-[#14a800] font-black">X</span> BlueX
              <span className="text-zinc-500">.ch</span>
            </a>

            <p className="text-zinc-400 text-xs font-semibold leading-relaxed max-w-[280px] mb-6">
              Switzerland's leading on-demand marketplace for local trades and home services.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4 text-zinc-500">
              <a href="#facebook" className="hover:text-white transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#instagram" className="hover:text-white transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#linkedin" className="hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#youtube" className="hover:text-white transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8 text-left">
            {/* For Customers */}
            <div className="flex flex-col gap-3">
              <h4 className="font-extrabold text-white text-[11px] uppercase tracking-wider">
                For Customers
              </h4>
              <ul className="space-y-2 text-[11px] font-semibold text-zinc-400">
                <li>
                  <a href="#how" className="hover:text-white transition-colors">
                    How it Works
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-white transition-colors">
                    Browse Services
                  </a>
                </li>
                <li>
                  <a href="#trust" className="hover:text-white transition-colors">
                    Trust & Security
                  </a>
                </li>
                <li>
                  <a href="#help" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>

            {/* For Professionals */}
            <div className="flex flex-col gap-3">
              <h4 className="font-extrabold text-white text-[11px] uppercase tracking-wider">
                For Professionals
              </h4>
              <ul className="space-y-2 text-[11px] font-semibold text-zinc-400">
                <li>
                  <a href="/signin?role=provider" className="hover:text-white transition-colors">
                    Become a Provider
                  </a>
                </li>
                <li>
                  <a href="#resources" className="hover:text-white transition-colors">
                    Provider Resources
                  </a>
                </li>
                <li>
                  <a href="#success" className="hover:text-white transition-colors">
                    Success Stories
                  </a>
                </li>
                <li>
                  <a href="#community" className="hover:text-white transition-colors">
                    Community
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="flex flex-col gap-3">
              <h4 className="font-extrabold text-white text-[11px] uppercase tracking-wider">
                Company
              </h4>
              <ul className="space-y-2 text-[11px] font-semibold text-zinc-400">
                <li>
                  <a href="#about" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#careers" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#blog" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Legal / Trust Column */}
          <div className="lg:col-span-3 flex flex-col gap-6 items-start text-left">
            {/* Legal */}
            <div className="flex flex-col gap-3">
              <h4 className="font-extrabold text-white text-[11px] uppercase tracking-wider">
                Legal
              </h4>
              <ul className="space-y-2 text-[11px] font-semibold text-zinc-400">
                <li>
                  <a href="#terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#cookie" className="hover:text-white transition-colors">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#imprint" className="hover:text-white transition-colors">
                    Imprint
                  </a>
                </li>
              </ul>
            </div>

            {/* Secure Payments Badge */}
            <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-3 items-start">
              <ShieldCheck className="w-5 h-5 text-[#22c55e] shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-white leading-none mb-1">
                  Secure. Safe. Trusted.
                </span>
                <p className="text-[9px] text-zinc-450 leading-relaxed font-semibold">
                  Your payments are protected with industry-leading security.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-white/5 gap-4">
          <p className="text-[10px] text-zinc-500 font-bold">
            © 2024 BlueX.ch. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
