"use client";

import { useState } from "react";
import api from "@/lib/api";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Clock,
  RefreshCw,
  Send,
  Shield,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function TestPanel() {
  const [apiKey, setApiKey] = useState("");
  const [identifier, setIdentifier] = useState("user_123");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ allowed: 0, blocked: 0 });
  const [step, setStep] = useState("idle"); // 'idle' | 'sending' | 'processing' | 'allowed' | 'blocked'

  const testLimit = async () => {
    if (!apiKey) {
      alert("Please enter an API Key");
      return;
    }

    setLoading(true);
    setStep("sending");
    const startTime = Date.now();

    // Small delay to let 'sending' animation be visible
    await new Promise((r) => setTimeout(r, 400));
    setStep("processing");

    try {
      const { data, headers } = await api.post(
        "/v1/limit",
        { identifier },
        { headers: { "x-api-key": apiKey } },
      );

      const duration = Date.now() - startTime;
      const resultStep = data.allowed ? "allowed" : "blocked";
      setStep(resultStep);

      setResults((prev) =>
        [
          {
            id: Date.now(),
            timestamp: new Date().toLocaleTimeString(),
            allowed: data.allowed,
            remaining: data.remaining,
            duration,
            limit: headers["x-ratelimit-limit"],
            status: 200,
          },
          ...prev,
        ].slice(0, 50),
      );

      if (data.allowed) {
        setStats((prev) => ({ ...prev, allowed: prev.allowed + 1 }));
      } else {
        setStats((prev) => ({ ...prev, blocked: prev.blocked + 1 }));
      }
    } catch (err) {
      const duration = Date.now() - startTime;
      const data = err.response?.data;
      const headers = err.response?.headers || {};

      setStep("blocked");

      setResults((prev) =>
        [
          {
            id: Date.now(),
            timestamp: new Date().toLocaleTimeString(),
            allowed: false,
            remaining: data?.remaining || 0,
            retryAfter: data?.retryAfter || headers["retry-after"],
            duration,
            limit: headers["x-ratelimit-limit"],
            status: err.response?.status || 500,
          },
          ...prev,
        ].slice(0, 50),
      );
      setStats((prev) => ({ ...prev, blocked: prev.blocked + 1 }));
    } finally {
      setLoading(false);
      // Reset visual after a delay
      setTimeout(() => setStep("idle"), 2000);
    }
  };

  const clearResults = () => {
    setResults([]);
    setStats({ allowed: 0, blocked: 0 });
    setStep("idle");
  };

  const total = stats.allowed + stats.blocked;
  const allowRate = total > 0 ? Math.round((stats.allowed / total) * 100) : 0;

  return (
    <div
      style={{
        background:
          "radial-gradient(circle at 10% 0%, rgba(68,110,255,0.07), transparent 28rem), radial-gradient(circle at 90% 0%, rgba(243,131,76,0.05), transparent 28rem), linear-gradient(180deg, #f8fafd 0%, #ffffff 100%)",
        minHeight: "100vh",
      }}
    >
      {/* ─── Nav ─── */}
      <nav
        style={{
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
        className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/60 bg-white/70 px-6 sm:px-8 lg:px-12"
      >
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <span className="h-5 w-px bg-slate-200" />
          <span className="text-xl font-bold tracking-tight text-slate-950">
            Test Panel
          </span>
        </div>

        <button
          onClick={clearResults}
          className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-800"
        >
          <RefreshCw className="h-4 w-4" />
          Clear
        </button>
      </nav>

      <main className="mx-auto max-w-4xl px-6 py-8 sm:px-8">
        <div className="space-y-6">
          {/* ─── Controls ─── */}
          <div
            style={{ boxShadow: "0 12px 36px rgba(55,65,81,0.06)" }}
            className="rounded-2xl border border-slate-200 bg-white/80 p-6 backdrop-blur-sm sm:p-8"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-slate-950">
                  Request Simulator
                </h2>
                <p className="text-sm text-slate-500">
                  Send test requests against your rate limit policy
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                  htmlFor="api-key"
                >
                  API Key
                </label>
                <input
                  id="api-key"
                  type="text"
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50/80 px-4 font-mono text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                  placeholder="rk_live_..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              <div>
                <label
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                  htmlFor="identifier"
                >
                  Identifier
                </label>
                <input
                  id="identifier"
                  type="text"
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50/80 px-4 font-mono text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                  placeholder="user_123"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={testLimit}
              disabled={loading}
              className="btn-sarvam mt-6 w-full disabled:pointer-events-none disabled:opacity-60"
            >
              <Send className={`h-4 w-4 ${loading ? "animate-pulse" : ""}`} />
              <span>{loading ? "Processing..." : "Send Request"}</span>
            </button>

            {/* ─── Visual Request Flow ─── */}
            <div className="mt-10 border-t border-slate-100 pt-8">
              <div className="relative flex items-center justify-between px-4 sm:px-12">
                {/* Node: Client */}
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300 ${step === "sending" ? "border-blue-500 bg-blue-50 text-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "border-slate-200 bg-white text-slate-400"}`}
                  >
                    <Send className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Client
                  </span>
                </div>

                {/* Path 1: Client to DVARA */}
                <div className="relative mx-2 h-1 flex-1 rounded-full bg-slate-100 overflow-hidden">
                  {step === "sending" && (
                    <div className="absolute left-0 top-0 h-full w-4 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6] animate-flow-send" />
                  )}
                </div>

                {/* Node: DVARA (The Brain) */}
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl border-2 transition-all duration-500 ${step === "processing" ? "scale-110 border-blue-500 bg-blue-50 text-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.3)] animate-pulse" : step === "allowed" ? "border-green-500 bg-green-50 text-green-600" : step === "blocked" ? "border-red-500 bg-red-50 text-red-600" : "border-slate-200 bg-white text-slate-400"}`}
                  >
                    <Shield
                      className={`h-8 w-8 ${step === "processing" ? "animate-spin-slow" : ""}`}
                    />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    DVARA
                  </span>
                </div>

                {/* Path 2: DVARA to Result */}
                <div className="relative mx-2 h-1 flex-1 rounded-full bg-slate-100 overflow-hidden">
                  {step === "allowed" && (
                    <div className="absolute left-0 top-0 h-full w-4 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e] animate-flow-allow" />
                  )}
                  {step === "blocked" && (
                    <div className="absolute left-0 top-0 h-full w-4 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444] animate-flow-block" />
                  )}
                </div>

                {/* Node: Destination */}
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300 ${step === "allowed" ? "border-green-500 bg-green-50 text-green-600" : step === "blocked" ? "border-red-500 bg-red-50 text-red-600" : "border-slate-200 bg-white text-slate-400"}`}
                  >
                    {step === "blocked" ? (
                      <AlertCircle className="h-5 w-5" />
                    ) : (
                      <CheckCircle className="h-5 w-5" />
                    )}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Result
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Stats ─── */}
          <div className="grid grid-cols-3 gap-4">
            {/* Allowed */}
            <div
              style={{ boxShadow: "0 8px 24px rgba(22,163,74,0.08)" }}
              className="rounded-2xl border border-green-100 bg-white/80 p-5 backdrop-blur-sm"
            >
              <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-green-600">
                Allowed
              </p>
              <p className="text-3xl font-bold text-green-600">
                {stats.allowed}
              </p>
            </div>

            {/* Blocked */}
            <div
              style={{ boxShadow: "0 8px 24px rgba(220,38,38,0.08)" }}
              className="rounded-2xl border border-red-100 bg-white/80 p-5 backdrop-blur-sm"
            >
              <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-red-600">
                Blocked (429)
              </p>
              <p className="text-3xl font-bold text-red-600">{stats.blocked}</p>
            </div>

            {/* Allow rate */}
            <div
              style={{ boxShadow: "0 8px 24px rgba(55,65,81,0.05)" }}
              className="rounded-2xl border border-slate-200 bg-white/80 p-5 backdrop-blur-sm"
            >
              <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Allow Rate
              </p>
              <p className="text-3xl font-bold text-slate-900">{allowRate}%</p>
            </div>
          </div>

          {/* ─── Log ─── */}
          <div
            style={{ boxShadow: "0 12px 36px rgba(55,65,81,0.05)" }}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="text-base font-semibold text-slate-950">
                Request Log
              </h3>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
                <Clock className="h-3 w-3" />
                Last 50
              </span>
            </div>

            {results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <Send className="h-7 w-7" />
                </div>
                <p className="text-sm font-medium text-slate-500">
                  No requests yet
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Send a test request above to see results here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {results.map((res) => (
                  <div
                    key={res.id}
                    className={`flex items-center justify-between px-6 py-4 transition-colors ${
                      res.allowed
                        ? "hover:bg-slate-50/60"
                        : "bg-red-50/30 hover:bg-red-50/50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {res.allowed ? (
                        <CheckCircle className="h-5 w-5 shrink-0 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-bold ${res.allowed ? "text-green-700" : "text-red-700"}`}
                          >
                            {res.allowed ? "ALLOWED" : "BLOCKED"}
                          </span>
                          <span className="font-mono text-xs text-slate-400">
                            {res.timestamp}
                          </span>
                        </div>
                        <div className="mt-0.5 flex gap-3 text-xs text-slate-500">
                          <span>{res.duration}ms</span>
                          <span>Remaining: {res.remaining}</span>
                          {res.retryAfter > 0 && (
                            <span className="font-semibold text-red-500">
                              Retry after: {res.retryAfter}s
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`rounded-md px-2.5 py-1 font-mono text-xs font-semibold ${
                        res.status === 200
                          ? "bg-green-50 text-green-700 ring-1 ring-green-200"
                          : "bg-red-50 text-red-700 ring-1 ring-red-200"
                      }`}
                    >
                      {res.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
