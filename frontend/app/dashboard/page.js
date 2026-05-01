'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import {
  ArrowRight,
  Edit2,
  Info,
  Key,
  LogOut,
  Plus,
  Shield,
  Trash2,
  Zap,
} from 'lucide-react';

export default function DashboardPage() {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [newKeyData, setNewKeyData] = useState({ name: '', cap: 10, rate: 2 });
  const [calculator, setCalculator] = useState({ requests: 10, period: 'second' });
  const [useSmartConfig, setUseSmartConfig] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchKeys();
  }, []);

  useEffect(() => {
    if (!useSmartConfig) return;

    const reqs = parseFloat(calculator.requests) || 0;
    let rate = reqs;
    if (calculator.period === 'minute') rate = reqs / 60;
    if (calculator.period === 'hour') rate = reqs / 3600;

    setNewKeyData(prev => ({
      ...prev,
      cap: Math.ceil(reqs),
      rate: parseFloat(rate.toFixed(8))
    }));
  }, [calculator, useSmartConfig]);

  const fetchKeys = async () => {
    try {
      const { data } = await api.get('/api/keys');
      setKeys(data);
    } catch (err) {
      console.error('Failed to fetch keys', err);
    } finally {
      setLoading(false);
    }
  };

  const createKey = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      if (editingKey) {
        await api.put(`/api/keys/${editingKey._id}`, newKeyData);
        setEditingKey(null);
      } else {
        await api.post('/api/keys', newKeyData);
      }
      setNewKeyData({ name: '', cap: 10, rate: 2 });
      setCalculator({ requests: 10, period: 'second' });
      fetchKeys();
    } catch (err) {
      alert('Failed to save key');
    } finally {
      setCreating(false);
    }
  };

  const deleteKey = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await api.delete(`/api/keys/${id}`);
      fetchKeys();
    } catch (err) {
      alert('Failed to delete key');
    }
  };

  const startEdit = (key) => {
    setEditingKey(key);
    setNewKeyData({ name: key.name, cap: key.cap, rate: key.rate });
    setCalculator({ requests: key.cap, period: 'second' });
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setNewKeyData({ name: '', cap: 10, rate: 2 });
    setCalculator({ requests: 10, period: 'second' });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div
      style={{
        background:
          'radial-gradient(circle at 10% 0%, rgba(68,110,255,0.07), transparent 28rem), radial-gradient(circle at 90% 0%, rgba(243,131,76,0.05), transparent 28rem), linear-gradient(180deg, #f8fafd 0%, #ffffff 100%)',
        minHeight: '100vh',
      }}
    >
      {/* ─── Nav ─── */}
      <nav
        style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
        className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/60 bg-white/70 px-6 sm:px-8 lg:px-12"
      >
        <span className="text-xl font-bold tracking-tight text-slate-950">DVARA</span>

        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900">
            Dashboard
          </span>
          <Link
            href="/test"
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            Test Panel
          </Link>
          <div className="mx-2 h-5 w-px bg-slate-200" />
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-500 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </nav>

      {/* ─── Main ─── */}
      <main className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-8 lg:flex-row">

          {/* ─── Left: Create / Edit ─── */}
          <div className="w-full space-y-5 lg:w-96 lg:shrink-0">

            {/* Form Card */}
            <div
              style={{ boxShadow: '0 12px 36px rgba(55,65,81,0.05)' }}
              className="rounded-2xl border border-slate-200 bg-white/80 p-6 backdrop-blur-sm sm:p-7"
            >
              {/* Card Header */}
              <div className="mb-6 flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                  {editingKey ? <Edit2 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                </div>
                <h2 className="text-lg font-semibold tracking-tight text-slate-950">
                  {editingKey ? 'Edit API Key' : 'Create API Key'}
                </h2>
              </div>

              <form onSubmit={createKey} className="space-y-5">
                {/* Key Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700" htmlFor="key-name">
                    Key Name
                  </label>
                  <input
                    id="key-name"
                    type="text"
                    required
                    className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50/80 px-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                    placeholder="e.g. Production API"
                    value={newKeyData.name}
                    onChange={(e) => setNewKeyData({ ...newKeyData, name: e.target.value })}
                  />
                </div>

                {/* Smart Toggle */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-600">Smart Calculator</label>
                  <button
                    type="button"
                    onClick={() => setUseSmartConfig(!useSmartConfig)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${useSmartConfig ? 'bg-blue-600' : 'bg-slate-300'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${useSmartConfig ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>

                {/* Calculator */}
                {useSmartConfig && (
                  <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-blue-600">
                      <Zap className="h-3.5 w-3.5" />
                      Rate Calculator
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-[11px] font-medium text-slate-500">Allow</label>
                        <input
                          type="number"
                          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10"
                          value={calculator.requests}
                          onChange={(e) => setCalculator({ ...calculator, requests: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] font-medium text-slate-500">Requests per</label>
                        <div className="relative">
                          <select
                            className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-8 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10"
                            value={calculator.period}
                            onChange={(e) => setCalculator({ ...calculator, period: e.target.value })}
                          >
                            <option value="second">Second</option>
                            <option value="minute">Minute</option>
                            <option value="hour">Hour</option>
                          </select>
                          <svg
                            className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cap & Rate */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      {useSmartConfig ? 'Cap (burst)' : 'Capacity'}
                    </label>
                    <input
                      type="number"
                      required
                      className={`h-11 w-full rounded-lg border border-slate-200 bg-slate-50/80 px-4 text-sm text-slate-900 outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-500/10 ${useSmartConfig ? 'cursor-not-allowed opacity-50' : ''}`}
                      value={newKeyData.cap || ''}
                      readOnly={useSmartConfig}
                      onChange={(e) =>
                        !useSmartConfig &&
                        setNewKeyData({ ...newKeyData, cap: e.target.value === '' ? '' : parseInt(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Rate (tok/s)</label>
                    <input
                      type="number"
                      step="any"
                      required
                      className={`h-11 w-full rounded-lg border border-slate-200 bg-slate-50/80 px-4 text-sm text-slate-900 outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-500/10 ${useSmartConfig ? 'cursor-not-allowed opacity-50' : ''}`}
                      value={newKeyData.rate || ''}
                      readOnly={useSmartConfig}
                      onChange={(e) =>
                        !useSmartConfig &&
                        setNewKeyData({ ...newKeyData, rate: e.target.value === '' ? '' : parseFloat(e.target.value) })
                      }
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={creating}
                    className="btn-sarvam flex-1 disabled:pointer-events-none disabled:opacity-60"
                  >
                    <span>{creating ? 'Saving...' : editingKey ? 'Update Key' : 'Generate Key'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  {editingKey && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Info box */}
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
              <div className="flex gap-3">
                <Info className="h-5 w-5 shrink-0 text-blue-500" />
                <p className="text-sm leading-relaxed text-slate-600">
                  <strong className="text-slate-800">Cap</strong> is the maximum burst of requests.{' '}
                  <strong className="text-slate-800">Rate</strong> is how fast tokens refill per second.
                </p>
              </div>
            </div>
          </div>

          {/* ─── Right: Table ─── */}
          <div className="min-w-0 flex-1">
            <div
              style={{ boxShadow: '0 12px 36px rgba(55,65,81,0.05)' }}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm"
            >
              {/* Table header */}
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <h2 className="text-lg font-semibold tracking-tight text-slate-950">Your API Keys</h2>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                  <Key className="h-3.5 w-3.5" />
                  {keys.length} {keys.length === 1 ? 'key' : 'keys'}
                </span>
              </div>

              {loading ? (
                <div className="py-16 text-center text-sm text-slate-400">Loading keys…</div>
              ) : keys.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <Key className="h-7 w-7" />
                  </div>
                  <p className="text-sm font-medium text-slate-500">No API keys yet</p>
                  <p className="mt-1 text-xs text-slate-400">Create one to get started.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100">
                        {['Name', 'Key', 'Config', 'Actions'].map(h => (
                          <th
                            key={h}
                            className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {keys.map((k) => (
                        <tr key={k._id} className="transition-colors hover:bg-slate-50/70">
                          <td className="px-6 py-4 text-sm font-semibold text-slate-900">{k.name}</td>
                          <td className="px-6 py-4">
                            <code className="inline-flex rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs text-slate-700">
                              {k.key}
                            </code>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                <Shield className="h-3 w-3" /> {k.cap}
                              </span>
                              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                <Zap className="h-3 w-3" /> {k.rate}/s
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-1">
                              <button
                                onClick={() => startEdit(k)}
                                className="rounded-lg p-2 text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-700"
                                title="Edit"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => deleteKey(k._id)}
                                className="rounded-lg p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-700"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
