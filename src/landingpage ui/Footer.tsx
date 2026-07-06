import { Facebook, Twitter, Linkedin, Github } from "lucide-react";

export default function Footer() {
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
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
          
          {/* Brand & Tagline */}
          <div className="flex flex-col gap-6 max-w-[400px]">
            <a href="#" className="flex items-center gap-2 text-white font-semibold text-3xl tracking-tight font-display mb-2 drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              ✦ BlueX
            </a>
            <p className="text-zinc-400 text-lg leading-relaxed">
              The AI-native Business Operating System. Unifying workflows, contracts, and payments into one seamless platform.
            </p>
          </div>

          {/* Newsletter */}
          <div className="w-full md:max-w-[400px]">
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Stay updated</h4>
            <form className="flex gap-2 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-indigo-500/20 rounded-xl blur-md pointer-events-none" />
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="relative flex-1 h-12 px-4 rounded-xl border border-white/10 bg-[#0a0715]/80 backdrop-blur-md text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 placeholder:text-zinc-500 transition-all shadow-inner"
              />
              <button 
                type="submit" 
                className="relative h-12 px-6 rounded-xl bg-white text-slate-900 font-medium hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Section: Socials & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 gap-6">
          <p className="text-sm text-zinc-500 font-medium">
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
