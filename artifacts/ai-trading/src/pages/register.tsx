import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRegister, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation, getSecurityQuestionOptions } from "@/lib/i18n";
import { LanguageToggle } from "@/components/language-toggle";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  displayName: z.string().min(2),
  selectedMode: z.enum(["beginner", "pro"]).default("beginner"),
  securityQuestion: z.string().min(1),
  securityAnswer: z.string().min(2),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const { t, lang } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const register = useRegister();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema as any),
    defaultValues: {
      email: "", password: "", displayName: "",
      selectedMode: "beginner", securityQuestion: "", securityAnswer: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await register.mutateAsync({ data: values });
      queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
      setLocation("/dashboard");
    } catch (err: unknown) {
      toast({
        title: t.auth.register_failed,
        description: ((err as { data?: { error?: string } })?.data?.error) ?? t.analyze.failed_desc,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center">
      <div className="w-full max-w-md flex flex-col flex-1">
      <div className="flex justify-end px-4 pt-4">
        <LanguageToggle />
      </div>
      <div className="flex flex-col items-center px-6 py-4">
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-center gap-2 mb-5">
            <BrandLogo className="w-10 h-10" />
            <span className="text-xl font-bold text-foreground">Trade Pilot</span>
          </div>

          <div className="mb-5">
            <h1 className="text-2xl font-bold text-foreground">{t.auth.create_account}</h1>
            <p className="text-sm text-muted-foreground mt-1">{t.auth.register_subtitle}</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="form-register">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.auth.display_name_label}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t.auth.display_name_placeholder} data-testid="input-display-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.auth.email_label}</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder={t.auth.email_placeholder} autoComplete="email" data-testid="input-email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.auth.password_label}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder={t.auth.password_placeholder}
                          data-testid="input-password"
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

              <FormField
                control={form.control}
                name="selectedMode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.analyze.mode_label}</FormLabel>
                    <div className="grid grid-cols-2 gap-2">
                      {(["beginner", "pro"] as const).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => field.onChange(mode)}
                          data-testid={`button-mode-${mode}`}
                          className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                            field.value === mode
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-background text-muted-foreground hover:border-primary/50"
                          }`}
                        >
                          {mode === "beginner" ? t.common.beginner : t.common.pro}
                        </button>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="securityQuestion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.auth.security_question_label}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-security-question">
                          <SelectValue placeholder={t.auth.security_question_placeholder} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getSecurityQuestionOptions(lang).map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="securityAnswer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.auth.security_answer_label}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showAnswer ? "text" : "password"}
                          placeholder={t.auth.security_answer_placeholder}
                          data-testid="input-security-answer"
                        />
                        <button
                          type="button"
                          onClick={() => setShowAnswer((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          data-testid="button-toggle-answer"
                        >
                          {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={register.isPending} data-testid="button-submit-register">
                {register.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {register.isPending ? t.auth.registering : t.auth.register_btn}
              </Button>

              <p
                className="text-[11px] text-muted-foreground text-center leading-relaxed"
                data-testid="text-consent"
              >
                {t.legal.consent_register
                  .split(/\{terms\}|\{privacy\}/)
                  .flatMap((part, idx, arr) => {
                    if (idx === arr.length - 1) return [part];
                    const isTerms = t.legal.consent_register
                      .split(part)[1]
                      ?.startsWith("{terms}");
                    return [
                      part,
                      isTerms ? (
                        <Link key={`t-${idx}`} href="/terms">
                          <a
                            className="text-primary hover:underline"
                            data-testid="link-consent-terms"
                          >
                            {t.legal.terms_link}
                          </a>
                        </Link>
                      ) : (
                        <Link key={`p-${idx}`} href="/privacy">
                          <a
                            className="text-primary hover:underline"
                            data-testid="link-consent-privacy"
                          >
                            {t.legal.privacy_link}
                          </a>
                        </Link>
                      ),
                    ];
                  })}
              </p>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {t.auth.have_account}{" "}
            <Link href="/login">
              <span className="text-primary font-medium hover:underline cursor-pointer" data-testid="link-login">
                {t.auth.login_link}
              </span>
            </Link>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
