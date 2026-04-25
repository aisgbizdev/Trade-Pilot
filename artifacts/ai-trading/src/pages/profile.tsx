import { useState } from "react";
import { Eye, EyeOff, Sun, Moon, LogOut, Shield, Loader2, ChevronRight } from "lucide-react";
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

const SECURITY_QUESTIONS = [
  "Nama hewan peliharaan pertama kamu?",
  "Nama kota tempat kamu lahir?",
  "Nama ibu kandung kamu?",
  "Nama sekolah dasar kamu?",
  "Nama teman terbaik masa kecil kamu?",
];

export default function ProfilePage() {
  const { user, refetch } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
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
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [secCurrentPassword, setSecCurrentPassword] = useState("");
  const [secQuestion, setSecQuestion] = useState("");
  const [secAnswer, setSecAnswer] = useState("");
  const [showSecAnswer, setShowSecAnswer] = useState(false);

  const handleThemeToggle = async (t: "light" | "dark") => {
    setTheme(t);
    await updateProfile.mutateAsync({ data: { themePreference: t } });
  };

  const handleSaveName = async () => {
    if (!newName.trim()) return;
    await updateProfile.mutateAsync({ data: { displayName: newName.trim() } });
    queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
    setEditingName(false);
    toast({ title: "Nama berhasil diperbarui" });
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) return;
    if (newPassword.length < 6) {
      toast({ title: "Password baru minimal 6 karakter", variant: "destructive" });
      return;
    }
    try {
      await changePassword.mutateAsync({ data: { currentPassword, newPassword } });
      setCurrentPassword("");
      setNewPassword("");
      setShowPasswordSection(false);
      toast({ title: "Password berhasil diubah" });
    } catch (err: any) {
      toast({ title: err?.data?.error ?? "Gagal mengubah password", variant: "destructive" });
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
      toast({ title: "Pertanyaan keamanan berhasil diubah" });
    } catch (err: any) {
      toast({ title: err?.data?.error ?? "Gagal mengubah pertanyaan keamanan", variant: "destructive" });
    }
  };

  const handleLogout = async () => {
    await logout.mutateAsync();
    queryClient.clear();
    setLocation("/login");
  };

  return (
    <Layout>
      <div className="px-4 py-5 space-y-4">
        <h1 className="text-xl font-bold text-foreground">Profil</h1>

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
                    Simpan
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
                    Edit
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
              {user?.role === "super_admin" ? "Super Admin" : user?.role === "admin" ? "Admin" : "User"}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {user?.selectedMode === "beginner" ? "Mode Pemula" : "Mode Pro"}
            </Badge>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Tema Tampilan</h3>
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
              Terang
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
              Gelap
            </button>
          </div>
        </Card>

        <Card className="p-4 space-y-3">
          <button
            className="w-full flex items-center justify-between py-2"
            onClick={() => setShowPasswordSection((v) => !v)}
            data-testid="button-toggle-password-section"
          >
            <span className="text-sm font-medium text-foreground">Ubah Password</span>
            <ChevronRight className={cn("w-4 h-4 text-muted-foreground transition-transform", showPasswordSection && "rotate-90")} />
          </button>

          {showPasswordSection && (
            <div className="space-y-3 pt-1 border-t border-border">
              <Input
                type="password"
                placeholder="Password saat ini"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                data-testid="input-current-password"
              />
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Password baru (min 6 karakter)"
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
              <Button
                size="sm"
                className="w-full"
                onClick={handleChangePassword}
                disabled={changePassword.isPending}
                data-testid="button-save-password"
              >
                {changePassword.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Simpan Password
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
              <span className="text-sm font-medium text-foreground">Pertanyaan Keamanan</span>
            </div>
            <ChevronRight className={cn("w-4 h-4 text-muted-foreground transition-transform", showSecuritySection && "rotate-90")} />
          </button>

          {showSecuritySection && (
            <div className="space-y-3 pt-1 border-t border-border">
              <Input
                type="password"
                placeholder="Password saat ini"
                value={secCurrentPassword}
                onChange={(e) => setSecCurrentPassword(e.target.value)}
                data-testid="input-sec-current-password"
              />
              <select
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground"
                value={secQuestion}
                onChange={(e) => setSecQuestion(e.target.value)}
                data-testid="select-security-question"
              >
                <option value="">Pilih pertanyaan keamanan baru</option>
                {SECURITY_QUESTIONS.map((q) => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
              <div className="relative">
                <Input
                  type={showSecAnswer ? "text" : "password"}
                  placeholder="Jawaban baru"
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
                Simpan Pertanyaan
              </Button>
            </div>
          )}
        </Card>

        {(user?.role === "admin" || user?.role === "super_admin") && (
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">Panel Admin</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => setLocation("/admin")}
                data-testid="button-go-admin"
              >
                <Shield className="w-4 h-4 mr-2" />
                Dashboard Admin
              </Button>
              {user?.role === "super_admin" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setLocation("/admin/users")}
                  data-testid="button-go-admin-users"
                >
                  Manajemen Pengguna
                </Button>
              )}
            </div>
          </Card>
        )}

        <Button
          variant="destructive"
          className="w-full"
          onClick={handleLogout}
          disabled={logout.isPending}
          data-testid="button-logout"
        >
          {logout.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <LogOut className="w-4 h-4 mr-2" />}
          Keluar
        </Button>
      </div>
    </Layout>
  );
}
