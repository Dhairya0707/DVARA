"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";
import {
  ArrowRight,
  GaugeCircle,
  LockKeyhole,
  Mail,
  Shield,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed :" + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page min-h-screen px-5 py-5 sm:px-8 lg:px-12">
      <section className="login-shell mx-auto flex min-h-[calc(100vh-40px)] w-full max-w-7xl flex-col overflow-hidden lg:grid lg:grid-cols-[1.05fr_0.95fr]">
        <div className="login-brand-panel relative flex min-h-[540px] flex-col px-6 py-7 sm:px-10 lg:px-12 lg:py-10">
          <header className="login-nav">
            <Link href="/" className="login-logo" aria-label="DVARA home">
              DVARA
            </Link>
            <div className="hidden items-center gap-3 text-sm font-medium text-slate-600 sm:flex">
              <span>API gateway</span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span>Token bucket</span>
            </div>
          </header>

          <div className="login-hero-content relative z-0 my-auto max-w-2xl py-14 lg:py-20">
            <div className="login-ornament" aria-hidden="true">
              <span />
              <Sparkles className="h-5 w-5" />
              <span />
            </div>

            <p className="login-eyebrow">
              India&apos;s sovereign rate limit layer
            </p>
            <h1 className="font-serif text-5xl leading-[0.96] text-slate-950 sm:text-6xl lg:text-7xl">
              Control traffic with calm precision
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Secure every API with predictable quotas, fast key controls, and
              operational clarity for teams building reliable backend systems.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ["Burst", "Token bucket caps"],
                ["Live", "Instant key control"],
                ["Clear", "Simple API limits"],
              ].map(([label, caption]) => (
                <div className="login-proof" key={label}>
                  <span>{label}</span>
                  <p>{caption}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="login-form-panel flex items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
          <div className="login-card w-full max-w-md">
            <div className="mb-8">
              <div className="login-form-icon mb-6">
                <GaugeCircle className="h-6 w-6" aria-hidden="true" />
              </div>
              <p className="text-sm font-semibold text-blue-700">
                Welcome back
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                Sign in to DVARA
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Manage API keys, capacity, and request flow from one focused
                workspace.
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  className="mb-2 block text-sm font-semibold text-slate-800"
                  htmlFor="email"
                >
                  Email address
                </label>
                <div className="login-input-wrap">
                  <Mail className="h-5 w-5" aria-hidden="true" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="login-input"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label
                  className="mb-2 block text-sm font-semibold text-slate-800"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="login-input-wrap">
                  <LockKeyhole className="h-5 w-5" aria-hidden="true" />
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="login-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-sarvam w-full"
              >
                <span>
                  {loading ? "Authenticating..." : "Experience DVARA"}
                </span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>

            <div className="mt-7 flex items-center justify-center gap-2 text-sm text-slate-600">
              <span>New to DVARA?</span>
              <Link className="login-text-link" href="/register">
                Create account
              </Link>
            </div>

            <div className="mt-8 border-t border-slate-200 pt-6">
              <p className="text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                Built for disciplined API traffic
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
