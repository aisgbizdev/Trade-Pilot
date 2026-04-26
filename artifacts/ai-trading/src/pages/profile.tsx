import { useState } from "react";
import { Eye, EyeOff, Sun, Moon, LogOut, Shield, Loader2, ChevronRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { useAuth } from "@/components/auth-provider";
import { useTheme } from "@/components/theme-provider";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import {
  useUpdateProfile,
  useChangePassword,
  useChangeSecurityQuestion,
  useLogout,
  getGetMeQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useTranslation, getSecurityQuestionOptions } from "@/lib/i18n";

export default function ProfilePage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const { t, lang } = useTranslation();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const changeSecurityQuestion = useChangeSecurityQuestion();
  const logout = useLogout();

  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.displayName ?? "");
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showSecuritySection, setShowSecuritySection] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [secCurrentPassword, setSecCurrentPassword] = useState("");
  const [showSecCurrentPassword, setShowSecCurrentPassword] = useState(false);
  const [secQuestion, setSecQuestion] = useState("");
  const [secAnswer, setSecAnswer] = useState("");
  const [showSecAnswer, setShowSecAnswer] = useState(false);

  const handleThemeToggle = async (th: "light" | "dark") => {
    setTheme(th);
    await updateProfile.mutateAsync({ data: { themePreference: th } });
  };

  const handleSaveName = async () => {
    if (!newName.trim()) return;
    await updateProfile.mutateAsync({ data: { displayName: newName.trim() } });
    queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
    setEditingName(false);
    toast({ title: t.profile.name_updated });
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) return;
    if (newPassword.length < 6) {
      toast({ title: t.profile.password_min_length, variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: t.profile.password_mismatch, variant: "destructive" });
      return;
    }
    try {
      await changePassword.mutateAsync({ data: { currentPassword, newPassword } });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordSection(false);
      toast({ title: t.profile.password_updated });
    } catch (err: unknown) {
      toast({ title: ((err as { data?: { error?: string } })?.data?.error) ?? t.profile.password_failed, variant: "destructive" });
    }
  };

  const handleChangeSecurityQuestion = async () => {
    if (!secCurrentPassword || !secQuestion || !secAnswer) return;
    try {
      await changeSecurityQuestion.mutateAsync({
        data: { currentPassword: secCurrentPassword, securityQuestion: secQuestion, securityAnswer: secAnswer },
      });
      setSecCurrentPassword("");
      setSecQuestion("");
      setSecAnswer("");
      setShowSecuritySection(false);
      toast({ title: t.profile.security_updated });
    } catch (err: unknown) {
      toast({ title: ((err as { data?: { error?: string } })?.data?.error) ?? t.profile.security_failed, variant: "destructive" });
    }
  };

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
    } catch {
      // Even if the server call fails (e.g. session already expired),
      // continue to fully reset client state below.
    }
    queryClient.cancelQueries();
    queryClient.clear();
    // Hard navigation to the landing page so every mounted component
    // (notifications SSE, me query, etc.) is torn down. Avoids the
    // dev-mode 401 overlay caused by zombie refetches after the
    // session cookie is cleared.
    window.location.assign("/");
  };

  return (
    <Layout>
      <div className="px-4 py-5 space-y-4">
        <h1 className="text-xl font-bold text-foreground">{t.profile.title}</h1>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
              {user?.displayName?.charAt(0)?.toUpperCase()}
            </div>
            <div className="flex-1">
              {editingName ? (
                <div className="flex gap-2">
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="h-8 text-sm"
                    data-testid="input-display-name"
                  />
                  <Button
                    size="sm"
                    className="h-8 px-3"
                    onClick={handleSaveName}
                    disabled={updateProfile.isPending}
                    data-testid="button-save-name"
                  >
                    {t.common.save}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-foreground" data-testid="text-display-name">
                    {user?.displayName}
                  </span>
                  <button
                    onClick={() => { setEditingName(true); setNewName(user?.displayName ?? ""); }}
                    className="text-xs text-primary hover:underline"
                    data-testid="button-edit-name"
                  >
                    {t.common.edit}
                  </button>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-0.5" data-testid="text-email">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {user?.role === "super_admin"
                ? t.profile.role_super_admin
                : user?.role === "admin"
                ? t.profile.role_admin
                : t.profile.role_user}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {user?.selectedMode === "beginner" ? `${t.profile.mode_label}: ${t.common.beginner}` : `${t.profile.mode_label}: ${t.common.pro}`}
            </Badge>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">{t.profile.theme_label}</h3>
          <div className="flex gap-2">
            <button
              onClick={() => handleThemeToggle("light")}
              data-testid="button-theme-light"
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-all",
                theme === "light"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary/50"
              )}
            >
              <Sun className="w-4 h-4" />
              {t.profile.light_mode}
            </button>
            <button
              onClick={() => handleThemeToggle("dark")}
              data-testid="button-theme-dark"
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-all",
                theme === "dark"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary/50"
              )}
            >
              <Moon className="w-4 h-4" />
              {t.profile.dark_mode}
            </button>
          </div>
        </Card>

        <Card className="p-4 space-y-3">
          <button
            className="w-full flex items-center justify-between py-2"
            onClick={() => setShowPasswordSection((v) => !v)}
            data-testid="button-toggle-password-section"
          >
            <span className="text-sm font-medium text-foreground">{t.profile.change_password}</span>
            <ChevronRight className={cn("w-4 h-4 text-muted-foreground transition-transform", showPasswordSection && "rotate-90")} />
          </button>

          {showPasswordSection && (
            <div className="space-y-3 pt-1 border-t border-border">
              <div className="relative">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder={t.profile.current_password_placeholder}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  data-testid="input-current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  data-testid="button-toggle-current-password"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  placeholder={t.profile.new_password_placeholder}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  data-testid="input-new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  data-testid="button-toggle-new-password"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t.profile.confirm_password_placeholder}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  data-testid="input-confirm-password"
                  className={confirmPassword && newPassword && confirmPassword !== newPassword ? "border-red-400" : ""}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  data-testid="button-toggle-confirm-password"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && newPassword && confirmPassword !== newPassword && (
                <p className="text-xs text-red-500 -mt-1">{t.profile.password_mismatch}</p>
              )}
              <Button
                size="sm"
                className="w-full"
                onClick={handleChangePassword}
                disabled={changePassword.isPending}
                data-testid="button-save-password"
              >
                {changePassword.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {t.profile.save_password}
              </Button>
            </div>
          )}
        </Card>

        <Card className="p-4 space-y-3">
          <button
            className="w-full flex items-center justify-between py-2"
            onClick={() => setShowSecuritySection((v) => !v)}
            data-testid="button-toggle-security-section"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">{t.auth.security_question_label}</span>
            </div>
            <ChevronRight className={cn("w-4 h-4 text-muted-foreground transition-transform", showSecuritySection && "rotate-90")} />
          </button>

          {showSecuritySection && (
            <div className="space-y-3 pt-1 border-t border-border">
              <div className="relative">
                <Input
                  type={showSecCurrentPassword ? "text" : "password"}
                  placeholder={t.profile.current_password_placeholder}
                  value={secCurrentPassword}
                  onChange={(e) => setSecCurrentPassword(e.target.value)}
                  data-testid="input-sec-current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowSecCurrentPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  data-testid="button-toggle-sec-current-password"
                >
                  {showSecCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <select
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground"
                value={secQuestion}
                onChange={(e) => setSecQuestion(e.target.value)}
                data-testid="select-security-question"
              >
                <option value="">{t.auth.security_question_placeholder}</option>
                {getSecurityQuestionOptions(lang).map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <div className="relative">
                <Input
                  type={showSecAnswer ? "text" : "password"}
                  placeholder={t.auth.security_answer_placeholder}
                  value={secAnswer}
                  onChange={(e) => setSecAnswer(e.target.value)}
                  data-testid="input-security-answer"
                />
                <button
                  type="button"
                  onClick={() => setShowSecAnswer((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showSecAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <Button
                size="sm"
                className="w-full"
                onClick={handleChangeSecurityQuestion}
                disabled={changeSecurityQuestion.isPending}
                data-testid="button-save-security-question"
              >
                {changeSecurityQuestion.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {t.profile.save_security}
              </Button>
            </div>
          )}
        </Card>

        {(user?.role === "admin" || user?.role === "super_admin") && (
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">{t.profile.admin_panel}</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => setLocation("/admin")}
                data-testid="button-go-admin"
              >
                <Shield className="w-4 h-4 mr-2" />
                {t.profile.admin_dashboard}
              </Button>
              {user?.role === "super_admin" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setLocation("/admin/users")}
                  data-testid="button-go-admin-users"
                >
                  {t.profile.user_management}
                </Button>
              )}
            </div>
          </Card>
        )}

        <Card
          className="p-4 border-amber-400/35 bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-orange-500/10"
          data-testid="card-solid-prime-cta"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
              {t.brand.sponsored_by}
            </span>
            <span className="text-sm font-extrabold tracking-wide text-amber-500 dark:text-amber-300">
              SOLID PRIME
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground/80 mb-2 leading-snug">
            {t.brand.solid_prime_subline} · {t.brand.solid_prime_regulated}
          </p>
          <p className="text-xs text-foreground/85 leading-relaxed mb-3">
            {t.brand.open_account_subtitle}
          </p>
          <Button asChild className="w-full btn-premium font-semibold">
            <a
              href="https://www.sg-berjangka.com"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-profile-open-solid-prime-account"
              className="flex items-center justify-center gap-2"
            >
              {t.brand.open_account_cta}
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </Button>
        </Card>

        <Button
          variant="destructive"
          className="w-full"
          onClick={handleLogout}
          disabled={logout.isPending}
          data-testid="button-logout"
        >
          {logout.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <LogOut className="w-4 h-4 mr-2" />}
          {t.profile.logout}
        </Button>
      </div>
    </Layout>
  );
}
