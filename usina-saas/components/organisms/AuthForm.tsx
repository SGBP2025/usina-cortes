"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";

interface AuthFormProps {
  mode: "login" | "register";
  action: (prevState: AuthFormState, formData: FormData) => Promise<AuthFormState>;
}

export interface AuthFormState {
  error?: string;
}

export function AuthForm({ mode, action }: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, {});
  const isLogin = mode === "login";

  return (
    <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-bg-surface p-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-white">
          {isLogin ? "Entrar" : "Criar conta"}
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          {isLogin ? "Acesse sua conta" : "Comece grátis com 30 minutos"}
        </p>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        {!isLogin && (
          <FormField
            label="Nome"
            name="name"
            type="text"
            placeholder="Seu nome"
            required
            autoComplete="name"
          />
        )}
        <FormField
          label="Email"
          name="email"
          type="email"
          placeholder="seu@email.com"
          required
          autoComplete="email"
        />
        <FormField
          label="Senha"
          name="password"
          type="password"
          placeholder={isLogin ? "Sua senha" : "Mínimo 8 caracteres"}
          required
          autoComplete={isLogin ? "current-password" : "new-password"}
        />
        {!isLogin && (
          <FormField
            label="Confirmar senha"
            name="confirmPassword"
            type="password"
            placeholder="Repita a senha"
            required
            autoComplete="new-password"
          />
        )}

        {state.error && (
          <p className="rounded-lg bg-error/10 border border-error/30 px-4 py-2.5 text-sm text-error">
            {state.error}
          </p>
        )}

        <Button type="submit" loading={pending} className="mt-2">
          {isLogin ? "Entrar" : "Criar conta"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        {isLogin ? "Não tem conta?" : "Já tem conta?"}{" "}
        <Link
          href={isLogin ? "/register" : "/login"}
          className="text-brand-primary hover:underline"
        >
          {isLogin ? "Criar conta" : "Entrar"}
        </Link>
      </p>
    </div>
  );
}
