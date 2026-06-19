import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Boxes, Upload, Package, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "StockBalanse — Inventory tracking that starts with your Excel file" }],
  }),
  component: LandingPage,
});

function LandingPage() {
  const { session } = useAuth();
  const ctaTo = session ? "/dashboard" : "/auth";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar ctaTo={ctaTo} />
      <main className="flex-1">
        <HeroSection ctaTo={ctaTo} />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
}

/* ── Navbar ──────────────────────────────────────────────────────────── */
function Navbar({ ctaTo }: { ctaTo: string }) {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-border/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="size-9 rounded-lg bg-primary grid place-items-center shadow-sm transition-transform group-hover:scale-105">
            <Boxes className="size-5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground tracking-tight">StockBalanse</span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/auth">Sign in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to={ctaTo}>Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

/* ── Hero ────────────────────────────────────────────────────────────── */
function HeroSection({ ctaTo }: { ctaTo: string }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=80')",
        }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-800/75 to-slate-900/80" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center pt-24 pb-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-xs font-medium px-3 py-1.5 rounded-full mb-8 backdrop-blur-sm">
          <span className="size-1.5 rounded-full bg-green-400 animate-pulse" />
          Free for small teams · No credit card required
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
          Inventory tracking that starts{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
            with your Excel file.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-white/75 max-w-2xl mx-auto leading-relaxed mb-10">
          Import your existing stock sheet, track outbounds, and export clean
          reports — built for small teams who already live in spreadsheets.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            className="h-12 px-7 text-base font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-shadow"
            asChild
          >
            <Link to={ctaTo}>
              Get started — it's free
            </Link>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="h-12 px-7 text-base font-medium bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm transition-all"
            asChild
          >
            <Link to="/demo">
              Try demo
              <ArrowRight className="size-4 ml-1.5" />
            </Link>
          </Button>
        </div>

        {/* Social proof */}
        <p className="mt-10 text-white/50 text-sm">
          Join hundreds of small teams already tracking smarter
        </p>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/40">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>
  );
}

/* ── Features ────────────────────────────────────────────────────────── */
const features = [
  {
    icon: Upload,
    title: "Excel Import",
    description:
      "Upload your existing .xlsx inventory in seconds. We map your columns automatically — no reformatting needed.",
    accent: "bg-blue-50 text-blue-600",
    ring: "ring-blue-100",
  },
  {
    icon: Package,
    title: "Live Stock Tracking",
    description:
      "Deduct outbounds with a reason, monitor low-stock alerts, and see your inventory in real-time across your team.",
    accent: "bg-emerald-50 text-emerald-600",
    ring: "ring-emerald-100",
  },
  {
    icon: Download,
    title: "Export Reports",
    description:
      "Download clean inventory snapshots as Excel any time. Share with suppliers, accountants, or your whole team.",
    accent: "bg-amber-50 text-amber-600",
    ring: "ring-amber-100",
  },
] as const;

function FeaturesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">
            Everything your small team needs
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            No complicated setup. Start with your spreadsheet and be running in
            under five minutes.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map(({ icon: Icon, title, description, accent, ring }) => (
            <div
              key={title}
              className={`relative rounded-2xl border bg-card p-8 shadow-sm ring-1 ${ring} hover:shadow-md transition-shadow group`}
            >
              <div
                className={`inline-flex size-12 rounded-xl items-center justify-center mb-5 ${accent}`}
              >
                <Icon className="size-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <Button size="lg" className="h-12 px-8 text-base" asChild>
            <Link to="/auth">
              Start for free
              <ArrowRight className="size-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ──────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t bg-card py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-md bg-primary grid place-items-center">
            <Boxes className="size-3.5 text-primary-foreground" />
          </div>
          <span>© 2026 StockBalanse</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-foreground transition-colors">
            Privacy
          </a>
          <Link to="/auth" className="hover:text-foreground transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    </footer>
  );
}
