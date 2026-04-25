import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { Eye, EyeOff, TrendingUp, Loader2, Brain } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useLogin, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

const schema = z.object({
  email: z.string().min(1, "Username atau email wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
  rememberMe: z.boolean().default(false),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const login = useLogin();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await login.mutateAsync({
        data: {
          email: values.email,
          password: values.password,
          rememberMe: values.rememberMe,
        },
      });
      queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
      setLocation("/dashboard");
    } catch (err: any) {
      toast({
        title: "Login gagal",
        description: err?.data?.error ?? "Email atau password salah",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      <div className="hero-gradient px-6 pt-12 pb-10 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-32 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-xl shadow-blue-500/30 mb-4 float-anim">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white mb-1">Selamat Datang</h1>
          <p className="text-sm text-slate-400">Masuk untuk melanjutkan analisis</p>
        </div>
      </div>

      <div className="flex-1 px-6 py-8 -mt-4">
        <div className="bg-card border border-border rounded-3xl p-6 shadow-xl">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              data-testid="form-login"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Username / Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Username atau email kamu"
                        autoComplete="username"
                        data-testid="input-email"
                        className="h-12 rounded-xl"
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
                    <FormLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Password kamu"
                          autoComplete="current-password"
                          data-testid="input-password"
                          className="h-12 rounded-xl pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
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
                      Selalu Ingat Saya
                    </FormLabel>
                  </FormItem>
                )}
              />

              <button
                type="submit"
                className="w-full h-12 rounded-xl btn-premium text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-60"
                disabled={login.isPending}
                data-testid="button-submit-login"
              >
                {login.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Brain className="w-4 h-4" />
                )}
                {login.isPending ? "Masuk..." : "Masuk ke Dashboard"}
              </button>
            </form>
          </Form>

          <div className="mt-4 text-center">
            <Link href="/forgot-password">
              <button
                className="text-sm text-primary hover:underline font-medium"
                data-testid="link-forgot-password"
              >
                Lupa password?
              </button>
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Belum punya akun?{" "}
          <Link href="/register">
            <span
              className="text-primary font-semibold hover:underline cursor-pointer"
              data-testid="link-register"
            >
              Daftar gratis
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
