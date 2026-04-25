import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { ArrowLeft, Eye, EyeOff, TrendingUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import {
  useGetForgotPasswordQuestion,
  useVerifySecurityAnswer,
  useResetPassword,
} from "@workspace/api-client-react";
import { useTranslation } from "@/lib/i18n";
import { LanguageToggle } from "@/components/language-toggle";

type Step = "email" | "question" | "reset" | "done";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const getQuestion = useGetForgotPasswordQuestion();
  const verifyAnswer = useVerifySecurityAnswer();
  const resetPasswordMutation = useResetPassword();

  const emailForm = useForm({ defaultValues: { email: "" } });
  const answerForm = useForm({ defaultValues: { answer: "" } });
  const passwordForm = useForm({
    resolver: zodResolver(z.object({ newPassword: z.string().min(6) })),
    defaultValues: { newPassword: "" },
  });

  const handleEmailSubmit = async (values: { email: string }) => {
    try {
      const res = await getQuestion.mutateAsync({ data: { email: values.email } });
      setEmail(values.email);
      setQuestion(res.securityQuestion);
      setStep("question");
    } catch (err: unknown) {
      const apiErr = err as { data?: { error?: string } };
      toast({
        title: t.auth.forgot_title,
        description: apiErr?.data?.error ?? t.analyze.failed_desc,
        variant: "destructive",
      });
    }
  };

  const handleAnswerSubmit = async (values: { answer: string }) => {
    try {
      const res = await verifyAnswer.mutateAsync({
        data: { email, securityAnswer: values.answer },
      });
      setResetToken(res.resetToken);
      setStep("reset");
    } catch (err: unknown) {
      const apiErr = err as { data?: { error?: string } };
      toast({
        title: t.auth.security_answer_label,
        description: apiErr?.data?.error ?? t.analyze.failed_desc,
        variant: "destructive",
      });
    }
  };

  const handlePasswordSubmit = async (values: { newPassword: string }) => {
    try {
      await resetPasswordMutation.mutateAsync({
        data: { resetToken, newPassword: values.newPassword },
      });
      setStep("done");
    } catch (err: unknown) {
      const apiErr = err as { data?: { error?: string } };
      toast({
        title: t.analyze.failed_title,
        description: apiErr?.data?.error ?? t.analyze.failed_desc,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      <div className="flex justify-end px-4 pt-4">
        <LanguageToggle />
      </div>
      <div className="flex flex-col items-center px-6 py-4">
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>

          {step !== "done" && (
            <Link href="/login">
              <button className="flex items-center gap-1 text-sm text-muted-foreground mb-6 hover:text-foreground" data-testid="link-back-to-login">
                <ArrowLeft className="w-4 h-4" />
                {t.auth.back_to_login}
              </button>
            </Link>
          )}

          {step === "email" && (
            <>
              <h1 className="text-2xl font-bold text-foreground mb-1">{t.auth.forgot_title}</h1>
              <p className="text-sm text-muted-foreground mb-6">{t.auth.forgot_subtitle}</p>
              <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">{t.auth.email_registered_label}</label>
                  <Input
                    {...emailForm.register("email")}
                    type="email"
                    placeholder={t.auth.email_placeholder}
                    className="mt-1"
                    data-testid="input-email"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={getQuestion.isPending} data-testid="button-find-account">
                  {getQuestion.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  {getQuestion.isPending ? t.auth.getting_question : t.auth.get_question_btn}
                </Button>
              </form>
            </>
          )}

          {step === "question" && (
            <>
              <h1 className="text-2xl font-bold text-foreground mb-3">{t.auth.security_question_label}</h1>
              <div className="bg-muted rounded-lg p-3 mb-6">
                <p className="text-sm font-medium text-foreground">{question}</p>
              </div>
              <form onSubmit={answerForm.handleSubmit(handleAnswerSubmit)} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">{t.auth.security_answer_label}</label>
                  <Input
                    {...answerForm.register("answer")}
                    placeholder={t.auth.answer_placeholder}
                    className="mt-1"
                    data-testid="input-security-answer"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={verifyAnswer.isPending} data-testid="button-verify-answer">
                  {verifyAnswer.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  {verifyAnswer.isPending ? t.auth.verifying : t.auth.verify_answer_btn}
                </Button>
              </form>
            </>
          )}

          {step === "reset" && (
            <>
              <h1 className="text-2xl font-bold text-foreground mb-1">{t.auth.new_password_label}</h1>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.auth.new_password_label}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              placeholder={t.auth.password_placeholder}
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
                  <Button type="submit" className="w-full" disabled={resetPasswordMutation.isPending} data-testid="button-reset-password">
                    {resetPasswordMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    {resetPasswordMutation.isPending ? t.auth.resetting : t.auth.reset_btn}
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
              <h1 className="text-2xl font-bold text-foreground mb-2">{t.auth.reset_success_title}</h1>
              <p className="text-sm text-muted-foreground mb-6">{t.auth.reset_success_subtitle}</p>
              <Button onClick={() => setLocation("/login")} className="w-full" data-testid="button-go-to-login">
                {t.auth.back_to_login}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
