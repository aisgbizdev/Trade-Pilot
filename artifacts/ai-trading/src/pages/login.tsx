import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useLogin, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/lib/i18n";
import { LanguageToggle } from "@/components/language-toggle";
import { BrandLogo } from "@/components/brand-logo";
import { useTrackEvent } from "@/hooks/use-track-event";

export default function LoginPage() {
  const { t } = useTranslation();
  const trackEvent = useTrackEvent();
  // Not wrapped in <Layout> (which tracks page views for every other
  // route), so this pre-auth funnel page tracks itself directly.
  useEffect(() => {
    trackEvent("page_view");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [showPassword, setShowPassword] = useState(false);
  const [resetSuccess] = useState(() => {
    const val = sessionStorage.getItem("password_reset_success");
    if (val === "1") {
      sessionStorage.removeItem("password_reset_success");
      return true;
    }
    return false;
  });
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const login = useLogin();

  const schema = z.object({
    email: z.string().min(1, t.auth.username_email_label),
    password: z.string().min(1, t.auth.password_label),
    rememberMe: z.boolean().default(false),
  });
  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema as any),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await login.mutateAsync({
        data: { email: values.email, password: values.password, rememberMe: values.rememberMe },
      });
      queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
      setLocation("/dashboard");
    } catch (err: unknown) {
      toast({
        title: t.auth.login_failed,
        description: ((err as { data?: { error?: string } })?.data?.error) ?? t.auth.login_error,
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
              <h1 className="text-2xl font-bold text-foreground">{t.auth.welcome_back}</h1>
              <p className="text-sm text-muted-foreground mt-1">{t.auth.welcome_subtitle}</p>
            </div>

            {resetSuccess && (
              <div
                className="flex items-start gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-4"
                data-testid="banner-reset-success"
                role="alert"
              >
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-800 dark:text-green-300">{t.auth.reset_success_title}</p>
                  <p className="text-xs text-green-700 dark:text-green-400 mt-0.5">{t.auth.reset_success_subtitle}</p>
                </div>
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="form-login">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.auth.username_email_label}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder={t.auth.username_placeholder}
                          autoComplete="username"
                          data-testid="input-email"
                        />
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
                            autoComplete="current-password"
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
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2.5">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-remember-me"
                        />
                      </FormControl>
                      <FormLabel className="!mt-0 text-sm font-normal cursor-pointer text-muted-foreground">
                        {t.auth.remember_me}
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={login.isPending} data-testid="button-submit-login">
                  {login.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  {login.isPending ? t.auth.logging_in : t.auth.login_btn}
                </Button>
              </form>
            </Form>

            <div className="mt-4 text-center">
              <Link href="/forgot-password">
                <button className="text-sm text-primary hover:underline font-medium" data-testid="link-forgot-password">
                  {t.auth.forgot_password}
                </button>
              </Link>
            </div>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              {t.auth.no_account}{" "}
              <Link href="/register">
                <span className="text-primary font-semibold hover:underline cursor-pointer" data-testid="link-register">
                  {t.auth.register_free}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
