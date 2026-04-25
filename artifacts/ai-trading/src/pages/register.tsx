import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { Eye, EyeOff, TrendingUp, Loader2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRegister, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

const SECURITY_QUESTIONS = [
  "Nama hewan peliharaan pertama kamu?",
  "Nama kota tempat kamu lahir?",
  "Nama ibu kandung kamu?",
  "Nama sekolah dasar kamu?",
  "Nama teman terbaik masa kecil kamu?",
];

const schema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  displayName: z.string().min(2, "Nama minimal 2 karakter"),
  selectedMode: z.enum(["beginner", "pro"]).default("beginner"),
  securityQuestion: z.string().min(1, "Pilih pertanyaan keamanan"),
  securityAnswer: z.string().min(2, "Jawaban minimal 2 karakter"),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const register = useRegister();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      displayName: "",
      selectedMode: "beginner",
      securityQuestion: "",
      securityAnswer: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await register.mutateAsync({ data: values });
      queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
      setLocation("/dashboard");
    } catch (err: any) {
      toast({
        title: "Pendaftaran gagal",
        description: err?.data?.error ?? "Terjadi kesalahan, coba lagi",
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
            <span className="text-xl font-bold text-foreground">AI Trading</span>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Daftar Akun</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Mulai perjalanan analisis trading kamu
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              data-testid="form-register"
            >
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nama kamu" data-testid="input-display-name" />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="kamu@email.com"
                        autoComplete="email"
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Minimal 6 karakter"
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
                    <FormLabel>Mode Trading</FormLabel>
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
                          {mode === "beginner" ? "Pemula" : "Pro"}
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
                    <FormLabel>Pertanyaan Keamanan</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-security-question">
                          <SelectValue placeholder="Pilih pertanyaan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SECURITY_QUESTIONS.map((q) => (
                          <SelectItem key={q} value={q}>
                            {q}
                          </SelectItem>
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
                    <FormLabel>Jawaban Keamanan</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showAnswer ? "text" : "password"}
                          placeholder="Jawaban pertanyaan keamanan"
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

              <Button
                type="submit"
                className="w-full"
                disabled={register.isPending}
                data-testid="button-submit-register"
              >
                {register.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Daftar
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link href="/login">
              <span
                className="text-primary font-medium hover:underline cursor-pointer"
                data-testid="link-login"
              >
                Masuk
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
