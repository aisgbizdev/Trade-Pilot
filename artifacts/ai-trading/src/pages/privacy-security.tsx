import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ChevronRight, Shield, Trash2, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteAccount } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTranslation } from "@/lib/i18n";

export default function PrivacySecurityPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const deleteAccount = useDeleteAccount();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteAccount = async () => {
    setError(null);
    try {
      await deleteAccount.mutateAsync({ data: { currentPassword: password } });
      queryClient.cancelQueries();
      queryClient.clear();
      window.location.assign("/");
    } catch (err) {
      const apiErr = err as { data?: { error?: string } };
      setError(apiErr?.data?.error ?? t.profile.delete_account_error_generic);
    }
  };

  return (
    <Layout>
      <main className="max-w-3xl mx-auto px-4 py-6 md:py-8 space-y-6" data-testid="privacy-security-page">
        <Link href="/profile" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          {t.profile.back_to_profile}
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">{t.profile.privacy_security_title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t.profile.privacy_security_intro}</p>
        </div>
        <Card className="p-2 shadow-sm divide-y divide-border/60">
          <Link href="/privacy" className="flex items-center gap-3 rounded-lg p-3.5 text-sm font-medium text-foreground hover:bg-muted/40" data-testid="link-profile-privacy-policy">
            <Shield className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <span className="flex-1">{t.profile.privacy_policy_link}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </Link>
          <Link href="/delete-account" className="flex items-center gap-3 rounded-lg p-3.5 text-sm font-medium text-foreground hover:bg-muted/40" data-testid="link-profile-deletion-info">
            <Shield className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <span className="flex-1">{t.profile.delete_info_link}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </Link>
        </Card>

        <section className="rounded-lg border border-destructive/20 p-4 sm:p-5 space-y-4" data-testid="card-delete-account">
          <div>
            <h2 className="flex items-center gap-2 text-sm font-semibold text-destructive">
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              {t.profile.delete_account_title}
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{t.profile.delete_account_description}</p>
          </div>
          <AlertDialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) {
                setPassword("");
                setConfirmed(false);
                setError(null);
              }
            }}
          >
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-auto h-10 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                data-testid="button-open-delete-account"
              >
                <Trash2 className="w-4 h-4 mr-2" aria-hidden="true" />
                {t.profile.delete_account_button}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent data-testid="dialog-delete-account">
              <AlertDialogHeader>
                <AlertDialogTitle>{t.profile.delete_account_confirm_title}</AlertDialogTitle>
                <AlertDialogDescription>{t.profile.delete_account_confirm_description}</AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-3 my-2">
                <div className="space-y-1.5">
                  <label htmlFor="delete-account-password" className="text-xs font-medium text-foreground">
                    {t.profile.delete_account_password_label}
                  </label>
                  <Input
                    id="delete-account-password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    data-testid="input-delete-account-password"
                    className="h-10"
                  />
                </div>
                <label className="flex items-start gap-2.5 text-xs text-foreground cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    className="mt-0.5"
                    checked={confirmed}
                    onChange={(event) => setConfirmed(event.target.checked)}
                    data-testid="checkbox-delete-account-confirm"
                  />
                  <span className="leading-snug">{t.profile.delete_account_checkbox_label}</span>
                </label>
                {error && (
                  <p className="text-xs text-destructive font-medium" data-testid="text-delete-account-error">{error}</p>
                )}
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel data-testid="button-cancel-delete-account">{t.common.cancel}</AlertDialogCancel>
                <AlertDialogAction
                  data-testid="button-confirm-delete-account"
                  disabled={!password || !confirmed || deleteAccount.isPending}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={(event) => {
                    event.preventDefault();
                    void handleDeleteAccount();
                  }}
                >
                  {deleteAccount.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" aria-hidden="true" />}
                  {t.profile.delete_account_confirm_button}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </section>
      </main>
    </Layout>
  );
}