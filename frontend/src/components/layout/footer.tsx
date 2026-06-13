import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-slate-950/50 px-6 py-12 backdrop-blur-md">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="text-xl font-bold text-cyan-300">
              QRGuard AI
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Securing the future of QR interactions with AI-driven threat intelligence and real-time security analysis.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Product</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/register" className="hover:text-cyan-400">Threat Scanner</Link></li>
              <li><Link to="/reports" className="hover:text-cyan-400">Community Intel</Link></li>
              <li><Link to="/api" className="hover:text-cyan-400">API Documentation</Link></li>
              <li><Link to="/enterprise" className="hover:text-cyan-400">Enterprise Solutions</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Company</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/about" className="hover:text-cyan-400">About Us</Link></li>
              <li><Link to="/blog" className="hover:text-cyan-400">Security Blog</Link></li>
              <li><Link to="/careers" className="hover:text-cyan-400">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-cyan-400">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/privacy" className="hover:text-cyan-400">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-cyan-400">Terms of Service</Link></li>
              <li><Link to="/security" className="hover:text-cyan-400">Security Disclosure</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/5 pt-8 text-center text-sm text-slate-500">
          <p>© 2026 Alt F4 Team. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
