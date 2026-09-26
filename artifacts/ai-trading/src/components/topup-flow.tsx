import { useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Loader2, Upload, Landmark, QrCode } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/i18n";
import { avatarSrc, uploadAvatar, validateAvatarFile } from "@/lib/avatar";
import {
  useGetTopupConfig,
  getGetTopupConfigQueryKey,
  useCreateTopupRequest,
  useCreateDokuCheckout,
  getGetMyTopupRequestsQueryKey,
  getGetCreditBalanceQueryKey,
  type TopupPackageOption,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

// Fast-track support contact for payment issues — international format
// (62 + local number without the leading 0), used to build a wa.me
// click-to-chat link.
const WHATSAPP_SUPPORT_NUMBER = "6282310384866";

export function buildWhatsAppSupportUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_SUPPORT_NUMBER}?text=${encodeURIComponent(message)}`;
}

// lucide-react doesn't ship brand glyphs — inline the real WhatsApp mark
// so the support link actually reads as "WhatsApp" at a glance instead of
// a generic chat bubble.
export function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
    </svg>
  );
}

/**
 * Shared package-select -> QRIS/proof-upload -> submit flow, used both by
 * the standalone /topup page and by <TopupDialog /> (the popup opened from
 * the quota-exceeded dialog so a user out of credit can top up without
 * leaving the page they were on). Deliberately excludes the balance card,
 * history list, and floating WhatsApp FAB — those stay page-only.
 */
export function TopupFlow({ onSubmitted }: { onSubmitted?: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: config } = useGetTopupConfig({ query: { queryKey: getGetTopupConfigQueryKey() } });

  const [step, setStep] = useState<"amount" | "pay">("amount");
  const [selectedPackage, setSelectedPackage] = useState<TopupPackageOption | null>(null);
  const [referenceNote, setReferenceNote] = useState("");
  const [proofObjectPath, setProofObjectPath] = useState<string | null>(null);
  const [isUploadingProof, setIsUploadingProof] = useState(false);
  const [showProofNotice, setShowProofNotice] = useState(false);
  // Only relevant for a "doku"-tier package (>= Rp20.000) — TEMPORARY (see
  // chat) while DOKU's own QRIS/e-wallet channels are still pending
  // verification: offers a choice between the real DOKU/VA checkout (which
  // carries the admin fee) and the same manual/QRIS fallback the Rp5.000
  // package always used (no fee, since there's no DOKU transaction to
  // cover the cost of).
  const [showMethodDialog, setShowMethodDialog] = useState(false);

  const createTopup = useCreateTopupRequest();
  const createDokuCheckout = useCreateDokuCheckout();

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

  // A "doku"-tier package first offers a payment-method choice (VA vs.
  // manual/QRIS fallback — see showMethodDialog above); the Rp5.000
  // manual-only package skips straight to the QRIS/proof-upload step since
  // there's nothing to choose.
  const handleContinue = () => {
    if (!selectedPackage) {
      toast({ title: t.topup.amount_too_small, variant: "destructive" });
      return;
    }
    if (selectedPackage.provider === "doku") {
      setShowMethodDialog(true);
      return;
    }
    setStep("pay");
    setShowProofNotice(true);
  };

  // VA/DOKU choice: leaves the app entirely for DOKU's own hosted checkout
  // page, so there's no in-app payment UI to show for it.
  const handleChooseVA = async () => {
    if (!selectedPackage) return;
    try {
      const result = await createDokuCheckout.mutateAsync({
        data: { amountRupiah: selectedPackage.amountRupiah },
      });
      window.location.href = result.paymentUrl;
    } catch (err: unknown) {
      toast({
        title: ((err as { data?: { error?: string } })?.data?.error) ?? t.topup.doku_checkout_failed,
        variant: "destructive",
      });
    }
  };

  // QRIS/manual choice: same in-app flow the Rp5.000 package always used —
  // for the package's own amount, with no admin fee added.
  const handleChooseQris = () => {
    setShowMethodDialog(false);
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
      // Auto-approved on submit (see routes/topups.ts) — the balance
      // changes immediately, so refresh it alongside the history list.
      queryClient.invalidateQueries({ queryKey: getGetMyTopupRequestsQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetCreditBalanceQueryKey() });
      setSelectedPackage(null);
      setReferenceNote("");
      setProofObjectPath(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setStep("amount");
      toast({ title: t.topup.submit_success_title });
      onSubmitted?.();
    } catch (err: unknown) {
      toast({ title: ((err as { data?: { error?: string } })?.data?.error) ?? t.topup.submit_error_title, variant: "destructive" });
    }
  };

  return (
    <>
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
            disabled={createDokuCheckout.isPending}
            data-testid="button-continue-topup"
          >
            {createDokuCheckout.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {selectedPackage?.provider === "doku"
              ? t.topup.continue_button_doku
              : t.topup.continue_button}
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
          <div
            className={
              "rounded-lg border-2 border-dashed p-3 space-y-2 transition-colors " +
              (proofObjectPath
                ? "border-emerald-500/40 bg-emerald-500/5"
                : "border-amber-500/50 bg-amber-500/5")
            }
            data-testid="section-proof-upload"
          >
            {!proofObjectPath && (
              <p
                className="flex items-start gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400"
                data-testid="text-proof-required-hint"
              >
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{t.topup.proof_required_hint}</span>
              </p>
            )}
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
              variant={proofObjectPath ? "outline" : "default"}
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
              {isUploadingProof
                ? t.topup.uploading_proof
                : proofObjectPath
                  ? t.topup.replace_proof_button
                  : t.topup.upload_proof_button}
            </Button>
            {proofObjectPath && (
              <div className="flex items-center gap-2" data-testid="text-proof-uploaded-confirmation">
                <img
                  src={avatarSrc(proofObjectPath) ?? undefined}
                  alt="Bukti pembayaran"
                  className="h-14 w-14 object-cover rounded border border-border shrink-0"
                  data-testid="img-proof-preview"
                />
                <p className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  {t.topup.proof_uploaded_confirmation}
                </p>
              </div>
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
          {!proofObjectPath && !createTopup.isPending && (
            <p
              className="text-[11px] text-center text-amber-700 dark:text-amber-400"
              data-testid="text-submit-disabled-hint"
            >
              {t.topup.submit_disabled_hint}
            </p>
          )}
        </Card>
      )}

      <Dialog open={showProofNotice} onOpenChange={setShowProofNotice}>
        <DialogContent data-testid="dialog-proof-required-notice">
          <DialogHeader>
            <DialogTitle>{t.topup.proof_notice_title}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">{t.topup.proof_notice_body}</p>
          <ol className="space-y-1.5 text-sm text-foreground list-decimal list-inside">
            <li>{t.topup.proof_notice_step_1}</li>
            <li>{t.topup.proof_notice_step_2}</li>
            <li>{t.topup.proof_notice_step_3}</li>
          </ol>
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

      <Dialog open={showMethodDialog} onOpenChange={setShowMethodDialog}>
        <DialogContent data-testid="dialog-payment-method">
          <DialogHeader>
            <DialogTitle>{t.topup.method_dialog_title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={handleChooseVA}
              disabled={createDokuCheckout.isPending}
              className="w-full flex items-start gap-3 rounded-lg border border-border p-3 text-left hover:border-primary/50 hover:bg-muted transition-colors disabled:opacity-60"
              data-testid="button-method-va"
            >
              <Landmark className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <span className="min-w-0">
                <span className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{t.topup.method_va_title}</span>
                  {createDokuCheckout.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />}
                </span>
                <span className="block text-xs text-muted-foreground mt-0.5">{t.topup.method_va_desc}</span>
                {selectedPackage && selectedPackage.adminFeeRupiah > 0 && (
                  <span className="block text-[11px] text-amber-700 dark:text-amber-400 mt-1" data-testid="text-method-va-fee">
                    {t.topup.method_va_fee_note
                      .replace("{fee}", selectedPackage.adminFeeRupiah.toLocaleString("id-ID"))
                      .replace("{total}", (amountNumber + selectedPackage.adminFeeRupiah).toLocaleString("id-ID"))}
                  </span>
                )}
              </span>
            </button>
            <button
              type="button"
              onClick={handleChooseQris}
              className="w-full flex items-start gap-3 rounded-lg border border-border p-3 text-left hover:border-primary/50 hover:bg-muted transition-colors"
              data-testid="button-method-qris"
            >
              <QrCode className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <span className="min-w-0">
                <span className="text-sm font-medium text-foreground">{t.topup.method_qris_title}</span>
                <span className="block text-xs text-muted-foreground mt-0.5">{t.topup.method_qris_desc}</span>
                <span className="block text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
                  {t.topup.method_qris_no_fee_note}
                </span>
              </span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
