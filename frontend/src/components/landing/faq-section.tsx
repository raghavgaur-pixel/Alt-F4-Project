import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "Is AEGIS QR free?",
    answer: "Yes, our core scanning and threat detection services are free for individual users. We also offer enterprise-grade solutions for fintech and security teams."
  },
  {
    question: "How does threat detection work?",
    answer: "We use a combination of AI-driven payload analysis, real-time URL reputation checks, and our proprietary community threat intelligence database to identify malicious patterns."
  },
  {
    question: "Does AEGIS QR store my scans?",
    answer: "For authenticated users, we store scan history to provide an audit trail. For guest users, data is processed in real-time and not permanently stored unless reported as malicious."
  },
  {
    question: "Can AEGIS QR detect phishing websites?",
    answer: "Absolutely. Our engine analyzes the destination of the QR code, looking for brand impersonation, suspicious scripts, and known phishing indicators."
  },
  {
    question: "What QR code types are supported?",
    answer: "We support all standard QR types, including URL, UPI/Payment, Wi-Fi, SMS, Email, Crypto addresses, and vCards."
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-16 text-center">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-cyan-400">Support</h2>
          <h3 className="mt-2 text-3xl font-bold text-white md:text-4xl">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="overflow-hidden rounded-2xl border border-white/5 bg-slate-950/50 transition-all">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-white/5"
              >
                <span className="font-semibold text-white">{faq.question}</span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-slate-400 transition-transform duration-200",
                    openIndex === index && "rotate-180"
                  )}
                />
              </button>
              <div
                className={cn(
                  "overflow-hidden px-6 transition-all duration-200 ease-in-out",
                  openIndex === index ? "max-h-40 pb-5 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <p className="text-slate-400 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
