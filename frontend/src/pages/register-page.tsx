import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { registerUser } from "@/api/auth";
import { MarketingShell } from "@/components/layout/marketing-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";

const schema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, "Must include an uppercase letter")
    .regex(/[a-z]/, "Must include a lowercase letter")
    .regex(/[0-9]/, "Must include a number")
});

type RegisterFormValues = z.infer<typeof schema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const { register, handleSubmit, formState, setError } = useForm<RegisterFormValues>({
    defaultValues: { email: "", password: "" }
  });
  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      setSession(data);
      navigate("/dashboard", { replace: true });
    },
    onError: (error: Error) => setError("root", { message: error.message })
  });

  return (
    <MarketingShell>
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center px-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
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
                {mutation.isPending ? "Creating account..." : "Register"}
              </Button>
            </form>
            <p className="mt-4 text-sm text-slate-400">
              Already registered?{" "}
              <Link to="/login" className="text-cyan-300">
                Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </MarketingShell>
  );
}

