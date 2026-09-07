import { useRef, useState } from "react";
import { format } from "date-fns";
import { id as idLocale, enUS } from "date-fns/locale";
import { Loader2, Wallet, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

const STATUS_BADGE: Record<TopupRequestStatus, "secondary" | "default" | "destructive"> = {
  pending: "secondary",
  approved: "default",
  rejected: "destructive",
};

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

  const [amount, setAmount] = useState("");
  const [referenceNote, setReferenceNote] = useState("");
  const [proofObjectPath, setProofObjectPath] = useState<string | null>(null);
  const [isUploadingProof, setIsUploadingProof] = useState(false);

  const createTopup = useCreateTopupRequest();

  const rupiahPerCredit = config?.rupiahPerCredit ?? 0;
  const amountNumber = Number(amount) || 0;
  const creditsPreview = rupiahPerCredit > 0 ? Math.floor(amountNumber / rupiahPerCredit) : 0;

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

  const handleSubmit = async () => {
    if (creditsPreview < 1) {
      toast({ title: t.topup.amount_too_small, variant: "destructive" });
      return;
    }
    try {
      await createTopup.mutateAsync({
        data: {
          amountRupiah: amountNumber,
          paymentReferenceNote: referenceNote.trim() || undefined,
          proofObjectPath: proofObjectPath ?? undefined,
        },
      });
      queryClient.invalidateQueries({ queryKey: getGetMyTopupRequestsQueryKey() });
      setAmount("");
      setReferenceNote("");
      setProofObjectPath(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
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

        <Card className="p-5 shadow-sm space-y-3" data-testid="card-qris">
          <h3 className="text-sm font-semibold text-foreground">{t.topup.qris_card_title}</h3>
          {config?.qrisImageUrl && (
            <img
              src={config.qrisImageUrl}
              alt="QRIS"
              className="w-full max-w-xs mx-auto rounded-lg border border-border"
              data-testid="img-qris"
            />
          )}
          <p className="text-xs text-muted-foreground text-center">
            {t.topup.rate_hint.replace("{rate}", rupiahPerCredit.toLocaleString("id-ID"))}
          </p>
        </Card>

        <Card className="p-5 shadow-sm space-y-3" data-testid="card-topup-form">
          <div>
            <Input
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={t.topup.amount_placeholder}
              data-testid="input-topup-amount"
            />
            {amountNumber > 0 && (
              <p className="text-xs text-muted-foreground mt-1" data-testid="text-credits-preview">
                {t.topup.amount_credits_preview.replace("{n}", String(creditsPreview))}
              </p>
            )}
          </div>
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
            disabled={createTopup.isPending || isUploadingProof}
            data-testid="button-submit-topup"
          >
            {createTopup.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {t.topup.submit_button}
          </Button>
        </Card>

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
    </Layout>
  );
}
