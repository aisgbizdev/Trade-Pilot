import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { ArrowLeft, Eye, EyeOff, TrendingUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import {
  useGetForgotPasswordQuestion,
  useVerifySecurityAnswer,
  useResetPassword,
} from "@workspace/api-client-react";

type Step = "email" | "question" | "reset" | "done";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [question, setQuestion] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [verifiedToken, setVerifiedToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const getQuestion = useGetForgotPasswordQuestion();
  const verifyAnswer = useVerifySecurityAnswer();
  const resetPassword = useResetPassword();

  const emailForm = useForm({ defaultValues: { email: "" } });
  const answerForm = useForm({ defaultValues: { answer: "" } });
  const passwordForm = useForm({
    resolver: zodResolver(
      z.object({ newPassword: z.string().min(6, "Password minimal 6 karakter") })
    ),
    defaultValues: { newPassword: "" },
  });

  const handleEmailSubmit = async (values: { email: string }) => {
    try {
      const result = await getQuestion.mutateAsync({ data: { email: values.email } });
      const res = result as any;
      setQuestion(res.question);
      setResetToken(res.resetToken);
      setStep("question");
    } catch (err: any) {
      toast({
        title: "Email tidak ditemukan",
        description: err?.data?.error ?? "Periksa kembali email kamu",
        variant: "destructive",
      });
    }
  };

  const handleAnswerSubmit = async (values: { answer: string }) => {
    try {
      const result = await verifyAnswer.mutateAsync({
        data: { resetToken, answer: values.answer },
      });
      const res = result as any;
      setVerifiedToken(res.verifiedToken);
      setStep("reset");
    } catch (err: any) {
      toast({
        title: "Jawaban salah",
        description: err?.data?.error ?? "Jawaban keamanan tidak cocok",
        variant: "destructive",
      });
    }
  };

  const handlePasswordSubmit = async (values: { newPassword: string }) => {
    try {
      await resetPassword.mutateAsync({
        data: { verifiedToken, newPassword: values.newPassword },
      });
      setStep("done");
    } catch (err: any) {
      toast({
        title: "Reset gagal",
        description: err?.data?.error ?? "Terjadi kesalahan",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      <div className="flex flex-col items-center px-6 py-8">
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>

          {step !== "done" && (
            <Link href="/login">
              <button className="flex items-center gap-1 text-sm text-muted-foreground mb-6 hover:text-foreground" data-testid="link-back-to-login">
                <ArrowLeft className="w-4 h-4" />
                Kembali ke login
              </button>
            </Link>
          )}

          {step === "email" && (
            <>
              <h1 className="text-2xl font-bold text-foreground mb-1">Lupa Password</h1>
              <p className="text-sm text-muted-foreground mb-6">
                Masukkan email kamu untuk melanjutkan
              </p>
              <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    {...emailForm.register("email")}
                    type="email"
                    placeholder="kamu@email.com"
                    className="mt-1"
                    data-testid="input-email"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={getQuestion.isPending}
                  data-testid="button-find-account"
                >
                  {getQuestion.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Cari Akun
                </Button>
              </form>
            </>
          )}

          {step === "question" && (
            <>
              <h1 className="text-2xl font-bold text-foreground mb-1">Pertanyaan Keamanan</h1>
              <div className="bg-muted rounded-lg p-3 mb-6">
                <p className="text-sm font-medium text-foreground">{question}</p>
              </div>
              <form onSubmit={answerForm.handleSubmit(handleAnswerSubmit)} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Jawaban Kamu</label>
                  <Input
                    {...answerForm.register("answer")}
                    placeholder="Jawaban pertanyaan keamanan"
                    className="mt-1"
                    data-testid="input-security-answer"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={verifyAnswer.isPending}
                  data-testid="button-verify-answer"
                >
                  {verifyAnswer.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Verifikasi
                </Button>
              </form>
            </>
          )}

          {step === "reset" && (
            <>
              <h1 className="text-2xl font-bold text-foreground mb-1">Password Baru</h1>
              <p className="text-sm text-muted-foreground mb-6">
                Buat password baru yang kuat
              </p>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password Baru</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              placeholder="Minimal 6 karakter"
                              data-testid="input-new-password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword((v) => !v)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                              data-testid="button-toggle-password"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={resetPassword.isPending}
                    data-testid="button-reset-password"
                  >
                    {resetPassword.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    Reset Password
                  </Button>
                </form>
              </Form>
            </>
          )}

          {step === "done" && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Password Direset!</h1>
              <p className="text-sm text-muted-foreground mb-6">
                Password kamu berhasil diubah. Silakan login dengan password baru.
              </p>
              <Button
                onClick={() => setLocation("/login")}
                className="w-full"
                data-testid="button-go-to-login"
              >
                Kembali ke Login
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
