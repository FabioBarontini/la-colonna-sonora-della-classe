"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const params = useSearchParams();

  async function go(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");

    const r = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (r.ok) {
      router.push(params.get("next") || "/docente/classe");
    } else {
      const d = await r.json();
      setErr(d.error || "Credenziali non valide.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-md">
        <a href="/" className="text-sm text-neutral-500">
          ← Home
        </a>

        <div className="card mt-16 p-7">
          <p className="text-sm uppercase tracking-[.2em] text-neutral-500">
            Area riservata
          </p>

          <h1 className="mt-2 text-3xl font-semibold">
            Accesso docente
          </h1>

          <form onSubmit={go} className="mt-8 space-y-4">
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-xl border border-neutral-200 px-4 py-3"
            />

            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-xl border border-neutral-200 px-4 py-3"
            />

            {err && (
              <p className="text-sm text-red-600">
                {err}
              </p>
            )}

            <button
              disabled={loading}
              className="w-full rounded-xl bg-black px-5 py-3.5 text-white"
            >
              {loading ? "Accesso…" : "Entra"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div>Caricamento...</div>}>
      <LoginForm />
    </Suspense>
  );
}
