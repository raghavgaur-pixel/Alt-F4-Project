import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { loginUser } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { useAuth } from "@/hooks/use-auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

type LoginFormValues = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSession } = useAuth();
  const { register, handleSubmit, formState, setError } = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "" }
  });
  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setSession(data);
      const redirectTo = (location.state as { from?: string } | null)?.from ?? "/dashboard";
      navigate(redirectTo, { replace: true });
    },
    onError: (error: Error) => {
      setError("root", { message: error.message });
    }
  });

  return (
    <MarketingShell>
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center px-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Login to QRGuard AI</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={handleSubmit((values) => {
                const parsed = schema.safeParse(values);
                if (!parsed.success) {
                  setError("root", { message: parsed.error.errors[0]?.message ?? "Invalid input" });
                  return;
                }
                mutation.mutate(parsed.data);
              })}
            >
              <Input placeholder="Email" type="email" {...register("email")} />
              <Input placeholder="Password" type="password" {...register("password")} />
              {formState.errors.root ? <p className="text-sm text-rose-300">{formState.errors.root.message}</p> : null}
              <Button className="w-full" type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Signing in..." : "Login"}
              </Button>
            </form>
            <p className="mt-4 text-sm text-slate-400">
              Need an account?{" "}
              <Link to="/register" className="text-cyan-300">
                Register
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </MarketingShell>
  );
}

