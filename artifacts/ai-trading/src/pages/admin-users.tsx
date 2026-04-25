import { useState } from "react";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { ChevronLeft, Plus, Trash2, RotateCcw, Shield, Loader2, Users, Eye, EyeOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Layout } from "@/components/layout";
import { ProtectedRoute } from "@/components/protected-route";
import { useToast } from "@/hooks/use-toast";
import {
  useGetAllUsers,
  getGetAllUsersQueryKey,
  useCreateUser,
  useDeleteUser,
  useResetUserPassword,
  useUpdateUserRole,
  type UsersList,
  type CreateUserBody,
  type UpdateUserRoleBodyRole,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

const SECURITY_QUESTIONS = [
  "Nama hewan peliharaan pertama kamu?",
  "Nama kota tempat kamu lahir?",
  "Nama ibu kandung kamu?",
  "Nama sekolah dasar kamu?",
  "Nama teman terbaik masa kecil kamu?",
];

const ROLE_LABELS: Record<string, string> = {
  user: "User",
  admin: "Admin",
  super_admin: "Super Admin",
};

const ROLE_BADGE: Record<string, "secondary" | "outline" | "destructive"> = {
  user: "secondary",
  admin: "outline",
  super_admin: "destructive",
};

function AdminUsersContent() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [createOpen, setCreateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [resetPasswordId, setResetPasswordId] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  const [createForm, setCreateForm] = useState({
    email: "",
    password: "",
    displayName: "",
    role: "user",
    selectedMode: "beginner",
    securityQuestion: SECURITY_QUESTIONS[0],
    securityAnswer: "",
  });

  const { data, isLoading } = useGetAllUsers(
    { limit: 200 },
    { query: { queryKey: getGetAllUsersQueryKey({ limit: 200 }) } },
  );

  const createUser = useCreateUser();
  const deleteUser = useDeleteUser();
  const resetUserPassword = useResetUserPassword();
  const updateUserRole = useUpdateUserRole();

  const users = (data as UsersList | undefined)?.users ?? [];

  const handleCreate = async () => {
    try {
      await createUser.mutateAsync({ data: createForm as CreateUserBody });
      queryClient.invalidateQueries({ queryKey: getGetAllUsersQueryKey() });
      setCreateOpen(false);
      toast({ title: "User berhasil dibuat" });
      setCreateForm({ email: "", password: "", displayName: "", role: "user", selectedMode: "beginner", securityQuestion: SECURITY_QUESTIONS[0], securityAnswer: "" });
    } catch (err: unknown) {
      toast({ title: ((err as { data?: { error?: string } })?.data?.error) ?? "Gagal membuat user", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUser.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getGetAllUsersQueryKey() });
      setDeleteId(null);
      toast({ title: "User berhasil dihapus" });
    } catch (err: unknown) {
      toast({ title: ((err as { data?: { error?: string } })?.data?.error) ?? "Gagal menghapus user", variant: "destructive" });
    }
  };

  const handleResetPassword = async (id: number) => {
    if (!newPassword || newPassword.length < 6) {
      toast({ title: "Password minimal 6 karakter", variant: "destructive" });
      return;
    }
    try {
      await resetUserPassword.mutateAsync({ id, data: { newPassword } });
      setResetPasswordId(null);
      setNewPassword("");
      toast({ title: "Password berhasil direset" });
    } catch (err: unknown) {
      toast({ title: ((err as { data?: { error?: string } })?.data?.error) ?? "Gagal mereset password", variant: "destructive" });
    }
  };

  const handleRoleChange = async (id: number, role: string) => {
    try {
      await updateUserRole.mutateAsync({ id, data: { role: role as UpdateUserRoleBodyRole } });
      queryClient.invalidateQueries({ queryKey: getGetAllUsersQueryKey() });
      toast({ title: "Role berhasil diubah" });
    } catch (err: unknown) {
      toast({ title: ((err as { data?: { error?: string } })?.data?.error) ?? "Gagal mengubah role", variant: "destructive" });
    }
  };

  return (
    <Layout>
      <div className="px-4 py-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLocation("/admin")}
              className="p-2 rounded-lg hover:bg-muted"
              data-testid="button-back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Manajemen User</h1>
              <p className="text-xs text-muted-foreground">{users.length} pengguna terdaftar</p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => setCreateOpen(true)}
            className="gap-1.5"
            data-testid="button-create-user"
          >
            <Plus className="w-4 h-4" />
            Tambah
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground opacity-40 mb-3" />
            <p className="text-sm text-muted-foreground">Belum ada pengguna</p>
          </div>
        ) : (
          <div className="space-y-2">
            {users.map((u) => (
              <Card key={u.id} className="p-3" data-testid={`card-user-${u.id}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-foreground">{u.displayName}</span>
                      <Badge
                        variant={ROLE_BADGE[u.role] ?? "secondary"}
                        className="text-[10px] px-1.5 py-0"
                      >
                        {ROLE_LABELS[u.role]}
                      </Badge>
                      <Badge
                        variant={(u as { analysisCount?: number }).analysisCount ?? 0 > 0 ? "default" : "outline"}
                        className="text-[10px] px-1.5 py-0"
                      >
                        {(u as { analysisCount?: number }).analysisCount ?? 0 > 0 ? "Aktif" : "Inaktif"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                    <p className="text-[10px] text-muted-foreground/70">
                      {(u as { analysisCount?: number }).analysisCount ?? 0} analisis
                      {(u as { createdAt?: string }).createdAt
                        ? ` · Daftar ${format(new Date((u as { createdAt: string }).createdAt), "dd MMM yyyy")}`
                        : ""}
                    </p>
                  </div>
                  <div className="flex gap-1.5 ml-2">
                    <button
                      onClick={() => { setResetPasswordId(u.id); setNewPassword(""); }}
                      className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                      data-testid={`button-reset-password-${u.id}`}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteId(u.id)}
                      className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                      data-testid={`button-delete-user-${u.id}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <Select
                    value={u.role}
                    onValueChange={(value) => handleRoleChange(u.id, value)}
                  >
                    <SelectTrigger className="h-7 text-xs" data-testid={`select-role-${u.id}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Tambah User Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input
                placeholder="Nama"
                value={createForm.displayName}
                onChange={(e) => setCreateForm({ ...createForm, displayName: e.target.value })}
                data-testid="input-create-display-name"
              />
              <Input
                type="email"
                placeholder="Email"
                value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                data-testid="input-create-email"
              />
              <div className="relative">
                <Input
                  type={showCreatePassword ? "text" : "password"}
                  placeholder="Password (min 6 karakter)"
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                  data-testid="input-create-password"
                />
                <button
                  type="button"
                  onClick={() => setShowCreatePassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  data-testid="button-toggle-create-password"
                >
                  {showCreatePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <Select
                value={createForm.role}
                onValueChange={(v) => setCreateForm({ ...createForm, role: v })}
              >
                <SelectTrigger data-testid="select-create-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
              <select
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground"
                value={createForm.securityQuestion}
                onChange={(e) => setCreateForm({ ...createForm, securityQuestion: e.target.value })}
                data-testid="select-create-security-question"
              >
                {SECURITY_QUESTIONS.map((q) => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
              <Input
                placeholder="Jawaban pertanyaan keamanan"
                value={createForm.securityAnswer}
                onChange={(e) => setCreateForm({ ...createForm, securityAnswer: e.target.value })}
                data-testid="input-create-security-answer"
              />
              <Button
                className="w-full"
                onClick={handleCreate}
                disabled={createUser.isPending}
                data-testid="button-confirm-create-user"
              >
                {createUser.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Buat User
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Hapus User</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              Yakin ingin menghapus user ini? Semua data analisisnya akan ikut terhapus.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteId(null)}>
                Batal
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => deleteId && handleDelete(deleteId)}
                disabled={deleteUser.isPending}
                data-testid="button-confirm-delete-user"
              >
                {deleteUser.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Hapus
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={resetPasswordId !== null} onOpenChange={() => setResetPasswordId(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Reset Password</DialogTitle>
            </DialogHeader>
            <div className="relative">
              <Input
                type={showResetPassword ? "text" : "password"}
                placeholder="Password baru (min 6 karakter)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                data-testid="input-new-reset-password"
              />
              <button
                type="button"
                onClick={() => setShowResetPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                data-testid="button-toggle-reset-password"
              >
                {showResetPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <Button
              className="w-full"
              onClick={() => resetPasswordId && handleResetPassword(resetPasswordId)}
              disabled={resetUserPassword.isPending}
              data-testid="button-confirm-reset-password"
            >
              {resetUserPassword.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Reset Password
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}

export default function AdminUsersPage() {
  return (
    <ProtectedRoute requiredRole="super_admin">
      <AdminUsersContent />
    </ProtectedRoute>
  );
}
