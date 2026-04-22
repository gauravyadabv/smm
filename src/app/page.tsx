"use client";

import { useState } from "react";

export default function Home() {
  const [brief, setBrief] = useState("");
  const [timeline, setTimeline] = useState<{ id: number; text: string; type: "user" | "cmo" | "system" }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brief.trim() || loading) return;

    setLoading(true);
    const newTimeline = [...timeline, { id: Date.now(), text: brief, type: "user" as const }];
    setTimeline(newTimeline);
    setBrief("");

    try {
      setTimeline((prev) => [
        ...prev,
        { id: Date.now() + 1, text: "CMO Agent is analyzing the brief and allocating budget...", type: "system" }
      ]);

      const res = await fetch("/api/cmo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: brief }),
      });

      const data = await res.json();
      
      if (res.ok && data.success) {
        setTimeline((prev) => [
          ...prev,
          { id: Date.now() + 2, text: data.data, type: "cmo" }
        ]);
      } else {
        setTimeline((prev) => [
          ...prev,
          { id: Date.now() + 2, text: "Error: Could not retrieve strategy. Sequence failed.", type: "system" }
        ]);
      }
    } catch (err) {
      setTimeline((prev) => [
        ...prev,
        { id: Date.now() + 2, text: "Network Error: Failed to contact CMO Agent.", type: "system" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleBatchTest = () => {
    if (loading) return;
    setLoading(true);
    setTimeline([]);
    
    setTimeline([{ id: Date.now(), text: "Starting High-Frequency Batch Task (50 micro-tx)...", type: "system" }]);
    
    setTimeout(() => {
      let mockLogs = "Executing 50 concurrent hook sentiment tests...\n\n";
      for(let i=1; i<=50; i++) {
        mockLogs += `[Tx ${i}/50] 0.0001 USDC -> Ext Worker (Hash: arc:tx:0x${Math.random().toString(16).substr(2, 32)})\n`;
      }
      mockLogs += "\n✅ [Arc L1] 50 Micro-transactions batch settled in 1 Block.\n⛽ Total Gas Spent: 0.0000 USDC\n💰 Net Margin VS Legacy: +$0.095";
      
      setTimeline((prev) => [...prev, { id: Date.now() + 1, text: mockLogs, type: "cmo" }]);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] p-4 md:p-12 font-sans selection:bg-[var(--color-accent)] selection:text-white">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="glass-panel p-8 relative overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-[var(--color-accent)] rounded-full blur-[150px] opacity-20 pointer-events-none" />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 text-[var(--color-accent)] text-xs uppercase tracking-widest font-semibold mb-6">
            v1.0 DRAFT — Active Development
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 glow-text">
            <span>SWAN</span> <span className="opacity-50 font-light">— Orchestrator Console</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] text-sm md:text-base max-w-2xl leading-relaxed">
            The world's first high-frequency Social Media Marketing economy. Submit a brief below to dispatch the CMO Agent. It will autonomously hire specialists, sign Arc L1 micro-payments, and deliver the final verified strategy.
          </p>
        </header>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-xs uppercase tracking-widest text-[var(--color-text-tertiary)] font-bold ml-1">
            Campaign Brief
          </label>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent2)] rounded-2xl blur opacity-30 group-focus-within:opacity-100 transition duration-500"></div>
            <textarea
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              className="relative w-full h-32 bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded-2xl p-6 text-sm text-white placeholder-[var(--color-text-tertiary)] focus:outline-none resize-none"
              placeholder="e.g., 'Run a full KPI audit on the latest TikTok posts and check audience sentiment before we launch the new Android app campaign.'"
              disabled={loading}
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleBatchTest}
              disabled={loading}
              className="px-6 py-3 bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border-primary)] hover:text-white font-medium rounded-xl text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Simulate 50-Tx Batch (Gate 5)
            </button>
            <button
              type="submit"
              disabled={loading || !brief.trim()}
              className="px-8 py-3 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent2)] text-white font-semibold rounded-xl text-sm transition hover:shadow-[0_0_20px_rgba(0,194,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Dispatching..." : "Execute Campaign Cycle"}
            </button>
          </div>
        </form>

        {/* Timeline / Terminal Output */}
        {timeline.length > 0 && (
          <div className="glass-panel p-1 rounded-xl">
            <div className="bg-[#050505] rounded-lg p-6 max-h-[600px] overflow-y-auto font-mono text-sm space-y-4">
              {timeline.map((item) => (
                <div key={item.id} className="flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="shrink-0 pt-0.5">
                    {item.type === "user" && <span className="text-[var(--color-gold)]">❯</span>}
                    {item.type === "system" && <span className="text-[var(--color-text-tertiary)]">⚙</span>}
                    {item.type === "cmo" && <span className="text-[var(--color-accent)]">✦</span>}
                  </div>
                  <div className={`flex-1 whitespace-pre-wrap ${
                    item.type === "cmo" ? "text-white leading-relaxed" : 
                    item.type === "system" ? "text-[var(--color-text-tertiary)] italic" : 
                    "text-[var(--color-text-secondary)]" 
                  }`}>
                    {item.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-4 animate-pulse">
                   <div className="shrink-0 text-[var(--color-text-tertiary)]">⚙</div>
                   <div className="text-[var(--color-text-tertiary)] italic">Awaiting Agent Network Response...</div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
