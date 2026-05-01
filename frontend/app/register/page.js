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
  UserPlus,
} from "lucide-react";

export default function RegisterPage() {
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
      const { data } = await api.post("/api/auth/register", {
        email,
        password,
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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
              <span className="login-logo-mark">
                <Shield className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>DVARA</span>
            </Link>
            <div className="hidden items-center gap-3 text-sm font-medium text-slate-600 sm:flex">
              <span>Cloud native</span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span>Production ready</span>
            </div>
          </header>

          <div className="login-hero-content relative z-0 my-auto max-w-2xl py-14 lg:py-20">
            <div className="login-ornament" aria-hidden="true">
              <span />
              <Sparkles className="h-5 w-5" />
              <span />
            </div>

            <p className="login-eyebrow">The backbone of reliable APIs</p>
            <h1 className="font-serif text-5xl leading-[0.96] text-slate-950 sm:text-6xl lg:text-7xl">
              Build with scale <br />
              <span className="italic opacity-80">in mind</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Join the platform designed for depth and rigor. Create an account
              to start securing your request flow with sovereign compute.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ["Scale", "Billion+ reqs/day"],
                ["Trust", "E2E encryption"],
                ["Speed", "< 1ms latency"],
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
                <UserPlus className="h-6 w-6" aria-hidden="true" />
              </div>
              <p className="text-sm font-semibold text-blue-700">Get Started</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                Join DVARA
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Create your developer account and deploy your first rate limit
                policy in seconds.
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
                  Work email
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
                    autoComplete="new-password"
                    required
                    className="login-input"
                    placeholder="Create a strong password"
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
                <span>{loading ? "Creating..." : "Launch Workspace"}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>

            <div className="mt-7 flex items-center justify-center gap-2 text-sm text-slate-600">
              <span>Already using DVARA?</span>
              <Link className="login-text-link" href="/login">
                Sign in
              </Link>
            </div>

            <div className="mt-8 border-t border-slate-200 pt-6">
              <p className="text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                Sovereign Infrastructure for India
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
