"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { loginUser } from "@/lib/services";
import useApi from "@/hooks/useApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const { data, error, loading, execute } = useApi(loginUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (formData: LoginFormData) => {
    execute(formData);
  };

  console.log({ data });

  useEffect(() => {
    if (data?.data.token) {
      localStorage.setItem("token", data.data.token);
      toast.success("Login successful");
      setTimeout(() => {
        router.push("/");
      }, 1500);
    }
  }, [data, router, toast]);

  useEffect(() => {
    if (error) {
      toast.warning("Invalid email or password");
    }
  }, [error, toast]);

  return (
    <div className="w-[80vw] lg:w-[40vw]  border rounded-xl mt-10 p-4 shadow-md">
      <CardHeader>
        <CardTitle className="text-center">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className={cn(errors.email && "border-red-500")}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              className={cn(errors.password && "border-red-500")}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <Loader2 className="animate-spin w-4 h-4 mr-2" />
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </CardContent>
    </div>
  );
}
