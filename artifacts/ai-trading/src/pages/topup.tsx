import { useRef, useState } from "react";
import { format } from "date-fns";
import { id as idLocale, enUS } from "date-fns/locale";
import { Loader2, Wallet, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Layout } from "@/components/layout";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/i18n";
import { avatarSrc, uploadAvatar, validateAvatarFile } from "@/lib/avatar";
import {
  useGetTopupConfig,
  getGetTopupConfigQueryKey,
  useGetCreditBalance,
  getGetCreditBalanceQueryKey,
  useCreateTopupRequest,
  useGetMyTopupRequests,
  getGetMyTopupRequestsQueryKey,
  type TopupRequestStatus,
  type TopupPackageOption,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

const STATUS_BADGE: Record<TopupRequestStatus, "secondary" | "default" | "destructive"> = {
  pending: "secondary",
  approved: "default",
  rejected: "destructive",
};

// Fast-track support contact for payment issues — international format
// (62 + local number without the leading 0), used to build a wa.me
// click-to-chat link.
const WHATSAPP_SUPPORT_NUMBER = "6282310384866";

function buildWhatsAppSupportUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_SUPPORT_NUMBER}?text=${encodeURIComponent(message)}`;
}

// lucide-react doesn't ship brand glyphs — inline the real WhatsApp mark
// so the support link/FAB actually reads as "WhatsApp" at a glance
// instead of a generic chat bubble.
function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
    </svg>
  );
}

export default function TopupPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t, lang } = useTranslation();
  const dateLocale = lang === "id" ? idLocale : enUS;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: config } = useGetTopupConfig({ query: { queryKey: getGetTopupConfigQueryKey() } });
  const { data: balanceData } = useGetCreditBalance({ query: { queryKey: getGetCreditBalanceQueryKey() } });
  const { data: history } = useGetMyTopupRequests(
    { page: 1, limit: 20 },
    { query: { queryKey: getGetMyTopupRequestsQueryKey({ page: 1, limit: 20 }) } },
  );

  const [step, setStep] = useState<"amount" | "pay">("amount");
  const [selectedPackage, setSelectedPackage] = useState<TopupPackageOption | null>(null);
  const [referenceNote, setReferenceNote] = useState("");
  const [proofObjectPath, setProofObjectPath] = useState<string | null>(null);
  const [isUploadingProof, setIsUploadingProof] = useState(false);
  const [showProofNotice, setShowProofNotice] = useState(false);

  const createTopup = useCreateTopupRequest();

  const packages = config?.packages ?? [];
  const amountNumber = selectedPackage?.amountRupiah ?? 0;
  const creditsPreview = selectedPackage?.credits ?? 0;

  const handleProofChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validationError = validateAvatarFile(file);
    if (validationError) {
      toast({
        title: validationError === "too_large" ? t.topup.proof_too_large : t.topup.proof_invalid_type,
        variant: "destructive",
      });
      return;
    }
    setIsUploadingProof(true);
    try {
      const objectPath = await uploadAvatar(file);
      setProofObjectPath(objectPath);
    } catch {
      toast({ title: t.topup.proof_upload_failed, variant: "destructive" });
    } finally {
      setIsUploadingProof(false);
    }
  };

  const handleContinue = () => {
    if (!selectedPackage) {
      toast({ title: t.topup.amount_too_small, variant: "destructive" });
      return;
    }
    setStep("pay");
    setShowProofNotice(true);
  };

  const handleSubmit = async () => {
    if (!selectedPackage) {
      toast({ title: t.topup.amount_too_small, variant: "destructive" });
      return;
    }
    if (!proofObjectPath) {
      toast({ title: t.topup.proof_required_error, variant: "destructive" });
      return;
    }
    try {
      await createTopup.mutateAsync({
        data: {
          amountRupiah: selectedPackage.amountRupiah,
          paymentReferenceNote: referenceNote.trim() || undefined,
          proofObjectPath,
        },
      });
      // Auto-approved on submit now (see routes/topups.ts) — the balance
      // changes immediately, so refresh it alongside the history list.
      queryClient.invalidateQueries({ queryKey: getGetMyTopupRequestsQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetCreditBalanceQueryKey() });
      setSelectedPackage(null);
      setReferenceNote("");
      setProofObjectPath(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setStep("amount");
      toast({ title: t.topup.submit_success_title });
    } catch (err: unknown) {
      toast({ title: ((err as { data?: { error?: string } })?.data?.error) ?? t.topup.submit_error_title, variant: "destructive" });
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6" data-testid="topup-container">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">{t.topup.title}</h1>

        <Card className="p-5 shadow-sm flex items-center justify-between" data-testid="card-credit-balance">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t.topup.balance_label}</p>
              <p className="text-xl font-bold text-foreground" data-testid="text-credit-balance">
                {balanceData?.balance ?? 0}
              </p>
            </div>
          </div>
        </Card>

        {step === "amount" ? (
          <Card className="p-5 shadow-sm space-y-3" data-testid="card-topup-form">
            <h3 className="text-sm font-semibold text-foreground">{t.topup.amount_step_title}</h3>
            <div className="grid grid-cols-2 gap-2">
              {packages.map((pkg) => {
                const selected = selectedPackage?.amountRupiah === pkg.amountRupiah;
                return (
                  <button
                    key={pkg.amountRupiah}
                    type="button"
                    onClick={() => setSelectedPackage(pkg)}
                    className={
                      "rounded-lg border px-3 py-2.5 text-center transition-colors " +
                      (selected
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:border-primary/50")
                    }
                    data-testid={`button-preset-${pkg.amountRupiah}`}
                  >
                    <span className="block text-sm font-medium">Rp{pkg.amountRupiah.toLocaleString("id-ID")}</span>
                    <span
                      className="block text-[11px] opacity-80 mt-0.5"
                      data-testid={`text-preset-credits-${pkg.amountRupiah}`}
                    >
                      {t.topup.amount_credits_preview.replace("{n}", String(pkg.credits))}
                    </span>
                  </button>
                );
              })}
            </div>
            {selectedPackage && (
              <p className="text-xs text-muted-foreground" data-testid="text-credits-preview">
                {t.topup.amount_credits_preview.replace("{n}", String(creditsPreview))}
              </p>
            )}
            <Button
              className="w-full"
              onClick={handleContinue}
              data-testid="button-continue-topup"
            >
              {t.topup.continue_button}
            </Button>
          </Card>
        ) : (
          <Card className="p-5 shadow-sm space-y-3" data-testid="card-qris">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-foreground">{t.topup.qris_card_title}</h3>
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-foreground"
                onClick={() => setStep("amount")}
                data-testid="button-change-amount"
              >
                {t.topup.change_amount}
              </button>
            </div>
            <p className="text-sm font-medium text-foreground" data-testid="text-pay-summary">
              {t.topup.pay_summary
                .replace("{amount}", amountNumber.toLocaleString("id-ID"))
                .replace("{n}", String(creditsPreview))}
            </p>
            {config?.qrisImageUrl && (
              <img
                src={config.qrisImageUrl}
                alt="QRIS"
                className="w-full max-w-xs mx-auto rounded-lg border border-border"
                data-testid="img-qris"
              />
            )}
            <p className="text-xs text-muted-foreground">{t.topup.pay_hint}</p>
            <Input
              value={referenceNote}
              onChange={(e) => setReferenceNote(e.target.value)}
              placeholder={t.topup.reference_note_placeholder}
              data-testid="input-reference-note"
            />
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleProofChange}
                data-testid="input-proof-file"
              />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingProof}
                data-testid="button-upload-proof"
              >
                {isUploadingProof ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                {isUploadingProof ? t.topup.uploading_proof : t.topup.upload_proof_button}
              </Button>
              <p className="text-[11px] text-muted-foreground mt-1" data-testid="text-proof-required-hint">
                {t.topup.proof_required_hint}
              </p>
              {proofObjectPath && (
                <img
                  src={avatarSrc(proofObjectPath) ?? undefined}
                  alt="Bukti pembayaran"
                  className="mt-2 h-20 w-20 object-cover rounded border border-border"
                  data-testid="img-proof-preview"
                />
              )}
            </div>
            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={createTopup.isPending || isUploadingProof || !proofObjectPath}
              data-testid="button-submit-topup"
            >
              {createTopup.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {t.topup.submit_button}
            </Button>
          </Card>
        )}

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">{t.topup.history_title}</h3>
          {!history?.requests.length ? (
            <p className="text-sm text-muted-foreground text-center py-6">{t.topup.history_empty}</p>
          ) : (
            <div className="space-y-2">
              {history.requests.map((r) => (
                <Card key={r.id} className="p-3" data-testid={`card-history-${r.id}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Rp{r.amountRupiah.toLocaleString("id-ID")} → {r.creditsRequested} kredit
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {format(new Date(r.createdAt), "dd MMM yyyy, HH:mm", { locale: dateLocale })}
                      </p>
                      {r.reviewNote && (
                        <p className="text-xs text-muted-foreground mt-1 italic">"{r.reviewNote}"</p>
                      )}
                    </div>
                    <Badge variant={STATUS_BADGE[r.status]} className="text-[10px] px-1.5 py-0 shrink-0">
                      {t.topup[`status_${r.status}` as "status_pending"]}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={showProofNotice} onOpenChange={setShowProofNotice}>
        <DialogContent data-testid="dialog-proof-required-notice">
          <DialogHeader>
            <DialogTitle>{t.topup.proof_notice_title}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">{t.topup.proof_notice_body}</p>
          <a
            href={buildWhatsAppSupportUrl(t.topup.support_whatsapp_message)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
            data-testid="link-whatsapp-support-dialog"
          >
            <WhatsAppGlyph className="w-3.5 h-3.5 shrink-0 text-[#25D366]" />
            {t.topup.support_whatsapp_cta}
          </a>
          <DialogFooter>
            <Button
              className="w-full"
              onClick={() => setShowProofNotice(false)}
              data-testid="button-proof-notice-ack"
            >
              {t.topup.proof_notice_ack}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Floating WhatsApp shortcut — this page only. The small inline
          links above weren't visible enough on their own. */}
      <a
        href={buildWhatsAppSupportUrl(t.topup.support_whatsapp_message)}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/25 transition-transform hover:scale-105 active:scale-95"
        style={{
          marginBottom: "env(safe-area-inset-bottom, 0px)",
          marginRight: "env(safe-area-inset-right, 0px)",
        }}
        data-testid="button-whatsapp-fab"
        aria-label={t.topup.support_whatsapp_cta}
        title={t.topup.support_whatsapp_cta}
      >
        <WhatsAppGlyph className="h-7 w-7" />
      </a>
    </Layout>
  );
}
