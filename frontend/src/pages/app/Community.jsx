import { Globe, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import PageHeader from "@/components/app/PageHeader";
import { communityNotify } from "@/lib/api";

export default function Community() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await communityNotify(email, "client_area");
      toast.success(res.already ? "You're already on the list" : "You're on the list — we'll notify you at launch.");
      setEmail("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-testid="community-page" className="space-y-8">
      <PageHeader eyebrow="Coming soon" title="Community Battles." description="Community vs Community trading wars are coming." />

      <div data-dark className="bg-[#0F0F12] text-white rounded-3xl p-10 lg:p-16 relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#A78BFA] rounded-full blur-[120px] opacity-30 pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#B4E04C] rounded-full blur-[120px] opacity-20 pointer-events-none" />
        <div className="relative max-w-2xl">
          <div className="w-14 h-14 rounded-2xl bg-[#A78BFA] grid place-items-center mb-5">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.05]">
            Your community. Your colours. Your glory.
          </h2>
          <p className="mt-4 text-white/70 text-lg max-w-lg">
            Entire trading communities will go head-to-head — Discord groups, schools, regional clubs — in the ultimate test of collective skill.
          </p>

          <form onSubmit={submit} className="mt-8 max-w-md" data-testid="community-page-form">
            <div className="flex gap-2 bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-2">
              <div className="flex-1 flex items-center gap-2 pl-3">
                <Mail className="w-4 h-4 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="trader@email.com"
                  className="flex-1 bg-transparent text-white placeholder:text-white/40 text-sm focus:outline-none py-2"
                />
              </div>
                <button type="submit" disabled={submitting} className="bg-[#B4E04C] text-[#0F0F12] font-semibold text-sm px-5 rounded-xl hover:bg-[var(--surface)] disabled:opacity-50">
                  {submitting ? "..." : "Notify me"}
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
