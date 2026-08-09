import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  CreditCard,
  Lock,
  Package,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { AppHeader } from "@/components/AppHeader";
import { GlassBackdrop } from "@/components/GlassBackdrop";
import { QueryErrorBoundary } from "@/components/QueryErrorBoundary";
import { TopicDetailView } from "@/components/TopicDetailView";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATALOG_ITEMS, catalogItem, formatPrice, searchCatalog } from "@/lib/catalog";

type Filter = "all" | "free" | "premium";

/* --------------------------- checkout modal --------------------------- */

function CheckoutModal({
  open,
  itemId,
  title,
  priceCents,
  onClose,
  onSuccess,
}: {
  open: boolean;
  itemId: string;
  title: string;
  priceCents: number;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const checkout = useMutation(api.store.checkout);
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const numberValid = number.replace(/\s/g, "").length >= 13;
  const expiryValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry);
  const cvcValid = /^\d{3,4}$/.test(cvc);
  const canPay = numberValid && expiryValid && cvcValid;

  const formatNumber = (v: string) =>
    v
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(\d{4})(?=\d)/g, "$1 ");

  const handlePay = async () => {
    setProcessing(true);
    setError(null);
    try {
      // Simulated processing delay (a real Stripe redirect would replace this).
      await new Promise((r) => setTimeout(r, 1100));
      await checkout({ itemId, itemTitle: title, amountCents: priceCents });
      setProcessing(false);
      toast.success("Purchase recorded — welcome aboard!");
      onSuccess();
    } catch (err) {
      setProcessing(false);
      setError(err instanceof Error ? err.message : "Checkout failed. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !processing && onClose()}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Checkout"
            className="glass-strong shine relative w-full max-w-md rounded-3xl p-7"
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            <button
              onClick={onClose}
              disabled={processing}
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-white/10"
              aria-label="Close checkout"
            >
              <X className="size-4" />
            </button>

            <div className="flex items-center gap-2">
              <Lock className="size-4 text-[#6fb5b0]" />
              <span className="tech-label">Secure checkout</span>
            </div>
            <h2 className="mt-3 text-xl font-extrabold tracking-tight text-wistaria">{title}</h2>

            {/* order summary */}
            <div className="glass-chip mt-4 flex items-center justify-between rounded-2xl px-4 py-3">
              <span className="text-sm font-semibold text-muted-foreground">Order total</span>
              <span className="font-mono text-lg font-bold">{formatPrice(priceCents)}</span>
            </div>

            {/* card fields */}
            <div className="mt-4 space-y-3">
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 size-4 text-muted-foreground" />
                <Input
                  value={number}
                  onChange={(e) => setNumber(formatNumber(e.target.value))}
                  placeholder="Card number"
                  inputMode="numeric"
                  className="pl-9 font-mono"
                  disabled={processing}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  value={expiry}
                  onChange={(e) => {
                    const d = e.target.value.replace(/\D/g, "").slice(0, 4);
                    setExpiry(d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d);
                  }}
                  placeholder="MM/YY"
                  inputMode="numeric"
                  className="font-mono"
                  disabled={processing}
                />
                <Input
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="CVC"
                  inputMode="numeric"
                  className="font-mono"
                  disabled={processing}
                />
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
            </div>

            <Button
              className="mt-5 w-full gap-2"
              size="lg"
              disabled={!canPay || processing}
              onClick={() => void handlePay()}
            >
              {processing ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Processing…
                </>
              ) : (
                <>
                  <Lock className="size-4" />
                  Pay {formatPrice(priceCents)}
                </>
              )}
            </Button>

            <p className="mt-4 flex items-start gap-1.5 text-[11px] leading-4 text-muted-foreground">
              <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-[#6fb5b0]" />
              Sandbox checkout — the order is recorded on your account. Real card
              processing connects when Stripe keys are configured. No card is
              charged or stored today.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* --------------------------- item detail ---------------------------- */

function CatalogItemPage({ slug }: { slug: string }) {
  const navigate = useNavigate();
  const orders = useQuery(api.store.myOrders);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const item = catalogItem(slug);

  if (item === undefined) {
    return (
      <main className="mx-auto max-w-3xl px-4 pb-32 pt-10 text-center sm:px-6">
        <p className="text-lg font-bold text-wistaria">Pack not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/catalog")}>
          <ArrowLeft className="size-4" />
          Back to catalog
        </Button>
      </main>
    );
  }

  const owned = (orders ?? []).some((o) => o.itemId === item.slug);
  const isTopicPack = Boolean(item.topicSlug);

  if (isTopicPack && item.topicSlug) {
    return (
      <main className="mx-auto max-w-4xl px-4 pb-32 pt-8 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => navigate("/catalog")}
            className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Catalog
          </button>
          <span className="glass-chip px-3 py-1 font-mono text-[10px] font-semibold text-[#6fb5b0]">
            FREE PACK
          </span>
        </div>
        <div className="mt-3">
          <TopicDetailView slug={item.topicSlug} backTo="/catalog" backLabel="Catalog" />
        </div>
      </main>
    );
  }

  const Icon = item.icon;
  const isOwned = owned && item.priceCents > 0;

  return (
    <main className="mx-auto max-w-4xl px-4 pb-32 pt-8 sm:px-6">
      <button
        onClick={() => navigate("/catalog")}
        className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Catalog
      </button>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel shine relative mt-4 overflow-hidden rounded-3xl p-6 sm:p-10"
      >
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: item.accent }}
        />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start">
          <div
            className="flex size-20 shrink-0 items-center justify-center rounded-3xl"
            style={{ backgroundColor: item.accent + "1f", color: item.accent }}
          >
            <Icon className="size-10" />
          </div>
          <div className="flex-1">
            <span className="tech-label">{item.category}</span>
            <h1 className="mt-2 text-balance text-3xl font-extrabold tracking-tight text-wistaria">
              {item.title}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              {item.description}
            </p>

            <div className="mt-5 space-y-2">
              {item.features.map((f) => (
                <div key={f} className="flex items-center gap-2.5 text-sm text-foreground/90">
                  <Check className="size-4 shrink-0" style={{ color: item.accent }} />
                  {f}
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <span className="font-mono text-3xl font-extrabold" style={{ color: item.accent }}>
                {formatPrice(item.priceCents)}
              </span>
              {isOwned ? (
                <span className="glass-chip flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-[#6fb5b0]">
                  <BadgeCheck className="size-4" />
                  In your library
                </span>
              ) : (
                <Button
                  size="lg"
                  onClick={() => setCheckoutOpen(true)}
                  className="gap-2 rounded-full px-8 shadow-[0_14px_34px_-12px_rgba(122,122,216,0.55)]"
                >
                  Buy now
                  <ArrowRight className="size-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <CheckoutModal
        open={checkoutOpen}
        itemId={item.slug}
        title={item.title}
        priceCents={item.priceCents}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={() => setCheckoutOpen(false)}
      />
    </main>
  );
}

/* ------------------------------ browse ------------------------------ */

function CatalogBrowse() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const items = useMemo(() => {
    const matched = searchCatalog(query);
    if (filter === "free") return matched.filter((i) => i.priceCents === 0);
    if (filter === "premium") return matched.filter((i) => i.priceCents > 0);
    return matched;
  }, [query, filter]);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-32 pt-10 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="tech-label">Catalog</span>
        <h1 className="mt-2 text-balance text-3xl font-extrabold tracking-tight text-wistaria sm:text-4xl">
          Study packs & passes
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          Every fundamentals pack is free. Premium packs add focus audio, quiz
          arenas and lifetime access — your library follows your account.
        </p>
      </motion.div>

      {/* search + filters */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search packs, subjects, tools…"
            className="glass-chip h-11 border-0 pl-10 font-medium"
            aria-label="Search the catalog"
          />
        </div>
        <div className="glass-chip flex items-center gap-1 rounded-xl p-1">
          {(
            [
              { key: "all", label: "All" },
              { key: "free", label: "Free" },
              { key: "premium", label: "Premium" },
            ] as { key: Filter; label: string }[]
          ).map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                filter === f.key
                  ? "bg-white/12 text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* grid */}
      <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => {
          const Icon = item.icon;
          const premium = item.priceCents > 0;
          return (
            <motion.button
              key={item.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(`/catalog/${item.slug}`)}
              className={`glass-panel shine group flex flex-col gap-4 rounded-3xl p-5 text-left ${
                premium ? "ring-1 ring-white/8" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className="flex size-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: item.accent + "1f", color: item.accent }}
                >
                  <Icon className="size-6" />
                </div>
                <span
                  className={`font-mono text-sm font-bold ${
                    premium ? "" : "text-[#6fb5b0]"
                  }`}
                  style={premium ? { color: item.accent } : undefined}
                >
                  {formatPrice(item.priceCents)}
                </span>
              </div>
              <div>
                <h2 className="text-base font-extrabold tracking-tight">{item.title}</h2>
                <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                  {item.category}
                  {premium ? " · Premium" : ""}
                </p>
              </div>
              <p className="mt-auto line-clamp-3 text-[13px] leading-5 text-muted-foreground">
                {item.description}
              </p>
              <span className="flex items-center gap-1.5 text-xs font-bold" style={{ color: item.accent }}>
                {premium ? "View & buy" : "Open free pack"}
                <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </motion.button>
          );
        })}
      </div>

      {items.length === 0 && (
        <div className="glass-panel mt-7 flex flex-col items-center gap-3 rounded-3xl p-12 text-center">
          <Package className="size-8 text-wistaria" />
          <p className="text-sm font-bold">No packs match your search</p>
          <p className="text-xs text-muted-foreground">
            Try a subject name, like "Physiology", or a tool, like "Audio".
          </p>
          <Button variant="outline" size="sm" onClick={() => setQuery("")}>
            Clear search
          </Button>
        </div>
      )}
    </main>
  );
}

/* ------------------------------- page ------------------------------- */

function CatalogInner() {
  const { slug } = useParams();
  return (
    <div className="min-h-screen">
      <GlassBackdrop />
      <AppHeader title={slug ? "Catalog" : undefined} />
      {slug ? <CatalogItemPage key={slug} slug={slug} /> : <CatalogBrowse />}
    </div>
  );
}

export default function Catalog() {
  return (
    <QueryErrorBoundary title="Couldn't load the catalog">
      <CatalogInner />
    </QueryErrorBoundary>
  );
}

export { CATALOG_ITEMS };
