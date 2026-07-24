import { createFileRoute, Link } from "@tanstack/react-router";
import FooterPageLayout from "@/landingpage ui/footer-pages/FooterPageLayout";
import Navbar from "@/landingpage ui/Navbar";
import Footer from "@/landingpage ui/Footer";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/$pageId")({
  component: StaticPage,
});

const VALID_PAGES = [
  "how-it-works",
  "browse-services",
  "trust-security",
  "help-center",
  "provider-resources",
  "success-stories",
  "community",
  "about-us",
  "careers",
  "blog",
  "contact-us",
  "terms-of-service",
  "privacy-policy",
  "cookie-policy",
  "imprint",
];

function StaticPage() {
  const { pageId } = Route.useParams();

  if (!VALID_PAGES.includes(pageId)) {
    return (
      <div className="min-h-screen w-full flex flex-col justify-between bg-zinc-50 font-sans">
        <Navbar />
        <div className="pt-32 pb-16 flex flex-col items-center justify-center flex-grow px-4 text-center">
          <div className="max-w-md">
            <h1 className="text-7xl font-extrabold text-zinc-900">404</h1>
            <h2 className="mt-4 text-xl font-bold text-zinc-800">Page Not Found</h2>
            <p className="mt-2 text-xs text-zinc-500 font-semibold leading-relaxed">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <div className="mt-6">
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-xl bg-[#2563eb] px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-blue-700 shadow-sm cursor-pointer"
              >
                Go Back Home
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return <FooterPageLayout pageId={pageId} />;
}
