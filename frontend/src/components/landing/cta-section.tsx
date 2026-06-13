import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-slate-950 px-8 py-20 text-center shadow-neon">
          {/* Decorative background elements */}
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl"></div>
          <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl"></div>

          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white md:text-5xl">
              Ready to analyze your next QR code?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
              Join thousands of users who trust QRGuard AI to secure their digital interactions. Get started today and scan with confidence.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="h-14 px-10 text-lg font-bold shadow-xl shadow-cyan-500/20">
                <Link to="/register">Start Scanning</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-10 text-lg font-bold">
                <Link to="/login">Login to Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
