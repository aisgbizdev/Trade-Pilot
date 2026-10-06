import { useRef, useState } from "react";
import { Camera, Eye, EyeOff, Sun, Moon, LogOut, Shield, Loader2, ChevronRight, ArrowUpRight, Bell, BellRing, Trash2, KeyRound, Wallet } from "lucide-react";
import { avatarSrc, uploadAvatar, validateAvatarFile } from "@/lib/avatar";
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
  useGetProgressionSummary,
  useGetCreditBalance,
  getGetCreditBalanceQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useTranslation, getSecurityQuestionOptions } from "@/lib/i18n";
import { useTrackOutbound } from "@/hooks/use-track-outbound";
import { SHOW_SPONSOR } from "@/lib/sponsor-flag";
import { ProgressionEmblem } from "@/components/progression/progression-emblem";
import { ExpandableExplanation } from "@/components/expandable-explanation";

export default function ProfilePage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const { t, lang } = useTranslation();
  const trackOutbound = useTrackOutbound();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const changeSecurityQuestion = useChangeSecurityQuestion();
  const logout = useLogout();

  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.displayName ?? "");
  const [themeSaving, setThemeSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarUrl = avatarSrc(user?.avatarUrl);

  const handlePickAvatar = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const err = validateAvatarFile(file);
    if (err === "too_large") {
      toast({ title: t.profile.avatar_too_large, variant: "destructive" });
      return;
    }
    if (err === "invalid_type") {
      toast({ title: t.profile.avatar_invalid_type, variant: "destructive" });
      return;
    }
    setAvatarUploading(true);
    try {
      const objectPath = await uploadAvatar(file);
      await updateProfile.mutateAsync({ data: { avatarUrl: objectPath } });
      queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
      toast({ title: t.profile.avatar_updated });
    } catch {
      toast({ title: t.profile.avatar_failed, variant: "destructive" });
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user?.avatarUrl) return;
    setAvatarUploading(true);
    try {
      await updateProfile.mutateAsync({ data: { avatarUrl: null } });
      queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
    } catch {
      toast({ title: t.profile.avatar_failed, variant: "destructive" });
    } finally {
      setAvatarUploading(false);
    }
  };
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
    if (th === theme || themeSaving || updateProfile.isPending) return;
    const previousTheme = theme;
    setTheme(th);
    setThemeSaving(true);
    try {
      await updateProfile.mutateAsync({ data: { themePreference: th } });
      queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
      toast({ title: t.profile.theme_updated });
    } catch {
      setTheme(previousTheme);
      toast({ title: t.profile.theme_update_failed, variant: "destructive" });
    } finally {
      setThemeSaving(false);
    }
  };

  const { data: progressionSummary } = useGetProgressionSummary();
  const creditBalance = useGetCreditBalance({ query: { queryKey: getGetCreditBalanceQueryKey() } });

  const handleSaveName = async () => {
    if (!newName.trim()) return;
    try {
      await updateProfile.mutateAsync({ data: { displayName: newName.trim() } });
      queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
      setEditingName(false);
      toast({ title: t.profile.name_updated });
    } catch {
      toast({ title: t.profile.name_update_failed, variant: "destructive" });
    }
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
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-6" data-testid="profile-container">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">{t.profile.title}</h1>
        </div>

        {/* Identity & Progression */}
        <Card className="p-5 md:p-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="flex items-center gap-5 flex-1 min-w-0">
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={handlePickAvatar}
                  disabled={avatarUploading}
                  data-testid="button-avatar-upload"
                  aria-label={t.profile.avatar_change}
                  className="relative w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl overflow-hidden ring-1 ring-border/60 hover:ring-primary/60 transition-all disabled:opacity-60"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={user?.displayName ?? ""}
                      className="w-full h-full object-cover"
                      data-testid="img-avatar"
                    />
                  ) : (
                    <span>{user?.displayName?.charAt(0)?.toUpperCase()}</span>
                  )}
                  {avatarUploading ? (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                    </div>
                  ) : (
                    <div className="absolute bottom-0 right-0 left-0 bg-background/80 backdrop-blur-sm border-t border-border/60 py-0.5 flex justify-center">
                      <Camera className="w-3.5 h-3.5 text-foreground" />
                    </div>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  capture="user"
                  onChange={handleAvatarChange}
                  className="hidden"
                  data-testid="input-avatar-file"
                />
              </div>

              <div className="space-y-1.5 min-w-0 flex-1">
                {editingName ? (
                  <div className="flex gap-2 max-w-sm">
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="h-9 text-sm"
                      data-testid="input-display-name"
                    />
                    <Button
                      size="sm"
                      className="h-9 px-4 shrink-0"
                      onClick={handleSaveName}
                      disabled={updateProfile.isPending || !newName.trim()}
                      data-testid="button-save-name"
                    >
                      {updateProfile.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" aria-hidden="true" />}
                      {t.common.save}
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-foreground truncate" data-testid="text-display-name">
                      {user?.displayName}
                    </span>
                    <button
                      onClick={() => { setEditingName(true); setNewName(user?.displayName ?? ""); }}
                      className="text-xs font-medium text-primary hover:underline shrink-0"
                      data-testid="button-edit-name"
                    >
                      {t.common.edit}
                    </button>
                  </div>
                )}
                <p className="text-sm text-muted-foreground truncate" data-testid="text-email">
                  {user?.email}
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <Badge variant="secondary" className="text-xs font-medium">
                    {user?.role === "super_admin"
                      ? t.profile.role_super_admin
                      : user?.role === "admin"
                      ? t.profile.role_admin
                      : t.profile.role_user}
                  </Badge>
                  {user?.avatarUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      disabled={avatarUploading}
                      data-testid="button-avatar-remove"
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors disabled:opacity-60"
                    >
                      <Trash2 className="w-3 h-3" />
                      {t.profile.avatar_remove}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {progressionSummary && (
              <button
                type="button"
                onClick={() => setLocation("/progression")}
                className="w-full md:w-auto shrink-0 flex items-center justify-between md:justify-start gap-4 p-3 md:pr-5 rounded-xl border border-border/50 bg-secondary/20 hover:bg-secondary/40 cursor-pointer transition-colors group mt-2 md:mt-0"
                aria-label={t.progression.title}
                data-testid="button-go-progression"
              >
                <div className="flex items-center gap-3.5">
                  <ProgressionEmblem level={progressionSummary.level} masteryLevel={progressionSummary.masteryLevel} className="w-12 h-12 drop-shadow-sm" />
                  <div className="min-w-0 text-left">
                     <p className="text-xs font-bold text-primary uppercase tracking-widest leading-none mb-1">
                      {progressionSummary.masteryLevel > 0
                        ? t.progression.mastery_level.replace("{n}", String(progressionSummary.masteryLevel))
                        : t.progression.level.replace("{n}", String(progressionSummary.level))}
                    </p>
                    <p className="text-base font-black text-foreground leading-tight truncate max-w-52">
                      {t.progression.rank.replace("{rank}", progressionSummary.rank)}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors ml-2" />
              </button>
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <div className="contents">
            <Card className="p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3 className="text-sm font-semibold text-foreground">{t.profile.theme_label}</h3>
              <div className="inline-flex self-start items-center rounded-xl border border-border/60 bg-muted/25 p-1" data-testid="theme-segmented-control" aria-busy={themeSaving}>
                <button
                  type="button"
                  onClick={() => handleThemeToggle("light")}
                  disabled={themeSaving || updateProfile.isPending}
                  data-testid="button-theme-light"
                  className={cn(
                    "inline-flex items-center justify-center gap-2 h-9 px-3.5 rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60",
                    theme === "light"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Sun className="w-4 h-4" />
                  {t.profile.light_mode}
                </button>
                <button
                  type="button"
                  onClick={() => handleThemeToggle("dark")}
                  disabled={themeSaving || updateProfile.isPending}
                  data-testid="button-theme-dark"
                  className={cn(
                    "inline-flex items-center justify-center gap-2 h-9 px-3.5 rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60",
                    theme === "dark"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Moon className="w-4 h-4" />
                  {t.profile.dark_mode}
                </button>
              </div>
            </Card>

            <Card className="p-2 shadow-sm divide-y divide-border/60" data-testid="profile-settings-group">
              <div className="py-1">
                <button
                  type="button"
                  className="w-full flex items-center gap-3.5 p-3.5 rounded-lg hover:bg-muted/40 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => setShowPasswordSection((v) => !v)}
                  data-testid="button-toggle-password-section"
                  aria-expanded={showPasswordSection}
                >
                  <KeyRound className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="flex-1 text-sm font-medium text-foreground">{t.profile.change_password}</span>
                  <ChevronRight className={cn("w-4 h-4 text-muted-foreground transition-transform shrink-0", showPasswordSection && "rotate-90")} />
                </button>
                {showPasswordSection && (
                  <div className="p-4 mx-2 mb-3 rounded-lg bg-muted/20 border border-border/50 space-y-3">
                    <div className="relative">
                      <Input
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder={t.profile.current_password_placeholder}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        data-testid="input-current-password"
                        className="h-10"
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
                        className="h-10"
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
                        className={cn("h-10", confirmPassword && newPassword && confirmPassword !== newPassword && "border-red-400")}
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
                      className="w-full sm:w-auto mt-2"
                      onClick={handleChangePassword}
                      disabled={changePassword.isPending}
                      data-testid="button-save-password"
                    >
                      {changePassword.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                      {t.profile.save_password}
                    </Button>
                  </div>
                )}
              </div>

              <div className="py-1">
                <button
                  type="button"
                  className="w-full flex items-center gap-3.5 p-3.5 rounded-lg hover:bg-muted/40 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => setShowSecuritySection((v) => !v)}
                  data-testid="button-toggle-security-section"
                  aria-expanded={showSecuritySection}
                >
                  <Shield className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="flex-1 text-sm font-medium text-foreground">{t.auth.security_question_label}</span>
                  <ChevronRight className={cn("w-4 h-4 text-muted-foreground transition-transform shrink-0", showSecuritySection && "rotate-90")} />
                </button>
                {showSecuritySection && (
                  <div className="p-4 mx-2 mb-3 rounded-lg bg-muted/20 border border-border/50 space-y-3">
                    <div className="relative">
                      <Input
                        type={showSecCurrentPassword ? "text" : "password"}
                        placeholder={t.profile.current_password_placeholder}
                        value={secCurrentPassword}
                        onChange={(e) => setSecCurrentPassword(e.target.value)}
                        data-testid="input-sec-current-password"
                        className="h-10"
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
                      className="w-full px-3 h-10 text-sm rounded-md border border-input bg-background text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
                        className="h-10"
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
                      className="w-full sm:w-auto mt-2"
                      onClick={handleChangeSecurityQuestion}
                      disabled={changeSecurityQuestion.isPending}
                      data-testid="button-save-security-question"
                    >
                      {changeSecurityQuestion.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                      {t.profile.save_security}
                    </Button>
                  </div>
                )}
              </div>
              <button
                type="button"
                className="w-full flex items-center gap-3.5 p-3.5 rounded-lg hover:bg-muted/40 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => setLocation("/profile/privacy-security")}
                data-testid="button-go-privacy-security"
              >
                <Shield className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-medium text-foreground">{t.profile.privacy_security_title}</span>
                  <span className="block text-xs leading-relaxed text-muted-foreground">{t.profile.privacy_security_subtitle}</span>
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
              <button
                type="button"
                className="w-full flex items-center gap-3.5 p-3.5 rounded-lg hover:bg-muted/40 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => setLocation("/my-alerts")}
                data-testid="button-go-my-alerts"
              >
                 <BellRing className="w-4 h-4 text-muted-foreground shrink-0" />
                 <span className="flex-1 min-w-0">
                   <span className="block text-sm font-medium text-foreground">{t.alerts.page_title}</span>
                   <span className="block text-xs leading-relaxed text-muted-foreground">{t.profile_extra.alerts_link_subtitle}</span>
                 </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
               <div>
               <button
                type="button"
                className="w-full flex items-center gap-3.5 p-3.5 rounded-lg hover:bg-muted/40 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => setLocation("/notifications#settings")}
                data-testid="button-go-notification-settings"
              >
                <Bell className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{t.profile_extra.notifications_link_title}</p>
                   <p className="text-xs leading-relaxed text-muted-foreground">{t.profile_extra.notifications_link_subtitle}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
               </div>
              <button
                type="button"
                className="w-full flex items-center gap-3.5 p-3.5 rounded-lg hover:bg-muted/40 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => setLocation("/topup")}
                data-testid="button-go-topup"
              >
                <Wallet className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-medium text-foreground">{t.profile.credit_topup_nav_label}</span>
                  {!creditBalance.isSuccess && (
                    <span className="block text-xs leading-relaxed text-muted-foreground" role="status" data-testid="credit-balance-status">
                      {creditBalance.isError ? t.profile.credit_balance_unavailable : t.profile.credit_balance_loading}
                    </span>
                  )}
                </span>
                {creditBalance.isSuccess && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0 mr-1" data-testid="badge-credit-balance">
                    {creditBalance.data.balance}
                  </Badge>
                )}
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
            </Card>
          </div>

          <div className="contents">
            {(user?.role === "admin" || user?.role === "super_admin") && (
              <Card className="p-5 shadow-sm space-y-3">
                <h3 className="text-sm font-semibold text-foreground pb-1">{t.profile.admin_panel}</h3>
                <div className="grid gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start h-10 px-4 border-border/50 hover:bg-muted/40"
                    onClick={() => setLocation("/admin")}
                    data-testid="button-go-admin"
                  >
                    <Shield className="w-4 h-4 mr-3 text-muted-foreground" />
                    {t.profile.admin_dashboard}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start h-10 px-4 border-border/50 hover:bg-muted/40"
                    onClick={() => setLocation("/admin/progression")}
                  >
                    <Shield className="w-4 h-4 mr-3 text-muted-foreground" />
                    {t.progression.admin_audit}
                  </Button>
                  {user?.role === "super_admin" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start h-10 px-4 border-border/50 hover:bg-muted/40"
                      onClick={() => setLocation("/admin/users")}
                      data-testid="button-go-admin-users"
                    >
                      <Shield className="w-4 h-4 mr-3 text-muted-foreground" />
                      {t.profile.user_management}
                    </Button>
                  )}
                </div>
              </Card>
            )}

            {SHOW_SPONSOR && (
              <Card
                className="p-5 border-amber-400/35 bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-orange-500/10 relative overflow-hidden"
                data-testid="card-solid-prime-cta"
              >
                <div className="flex items-center gap-2 mb-2">
                   <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {t.brand.sponsored_by}
                  </span>
                  <span className="text-sm font-extrabold tracking-wide text-amber-500 dark:text-amber-300">
                    SOLID PRIME
                  </span>
                </div>
                 <p className="text-xs text-muted-foreground mb-3 leading-snug">
                  {t.brand.solid_prime_subline} · {t.brand.solid_prime_regulated}
                </p>
                 <ExpandableExplanation inline className="mb-4">{t.brand.open_account_subtitle}</ExpandableExplanation>
                <Button asChild className="w-full btn-premium font-semibold h-11">
                  <a
                    href="https://www.sg-berjangka.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="link-profile-open-solid-prime-account"
                    className="flex items-center justify-center gap-2"
                    onClick={() => trackOutbound("profile-cta", "sg-berjangka")}
                  >
                    {t.brand.open_account_cta}
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </Button>
              </Card>
            )}

          </div>
        </div>

        {/* Layout's own footer (every authenticated page) now carries the
            App Store / Play Store badges — no need to duplicate them here. */}

        <div className="flex justify-start sm:justify-end pt-2">
          <Button
            variant="outline"
            className="w-full sm:w-auto h-10 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={handleLogout}
            disabled={logout.isPending}
            data-testid="button-logout"
          >
            {logout.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <LogOut className="w-4 h-4 mr-2" />}
            {t.profile.logout}
          </Button>
        </div>
      </div>
    </Layout>
  );
}
