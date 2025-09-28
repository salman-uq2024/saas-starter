"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!email) {
      setError("Enter your email to receive a sign-in link.");
      return;
    }

    startTransition(async () => {
      const result = await signIn("email", {
        email,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError("We couldn’t send the magic link. Double-check the email and try again.");
      } else {
        setMessage("Magic link sent. Check your email — in development it appears in the server logs.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="email">
          Work email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>
      {error ? (
        <Alert variant="danger">{error}</Alert>
      ) : null}
      {message ? (
        <Alert variant="success">{message}</Alert>
      ) : null}
      <Button type="submit" className="w-full" size="lg" isLoading={isPending}>
        Send magic link
      </Button>
      <p className="text-xs text-slate-500">
        No passwords to manage. We email you a one-time link. In development, the link is logged to the terminal for quick testing.
      </p>
    </form>
  );
}
