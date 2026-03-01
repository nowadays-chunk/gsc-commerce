"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Cpu,
    ArrowLeft,
    Search,
    ShoppingBag,
    Activity,
    Zap,
    ShieldCheck,
    Target,
    Globe,
    TrendingUp
} from "lucide-react";

export default function DocumentationPage() {
    return (
        <div className="min-h-screen bg-[#060608] text-zinc-100 font-sans selection:bg-blue-500/30">
            {/* Header */}
            <header className="border-b border-white/5 bg-black/40 backdrop-blur-2xl sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-widest">Back to Studio</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Cpu className="text-blue-500 w-5 h-5" />
                        <h1 className="text-sm font-black tracking-widest uppercase">Engine Specifications</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-20 space-y-24">
                {/* Intro */}
                <section className="space-y-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
                            How the Quant Engine <br />Processes Monetization.
                        </h2>
                        <p className="text-xl text-zinc-400 leading-relaxed max-w-2xl">
                            The Quant Monetization Studio uses a multi-layered simulation model to forecast SEO-driven financial outcomes. It operates on two independent calculation paths anchored by a unified SEO Foundation.
                        </p>
                    </motion.div>
                </section>

                {/* Engine 1: SEO Foundation */}
                <section className="space-y-12">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                            <Search className="text-blue-400 w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tight">1. SEO Foundation (The Core)</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <h4 className="font-bold text-zinc-100 underline decoration-blue-500/50 underline-offset-8 decoration-2">Traffic Simulation</h4>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                Our core engine simulates Google's indexing velocity and ranking distribution over time. It uses a <strong>Logarithmic Growth Curve</strong> to model how new content acquires authority within its niche competition level.
                            </p>
                            <ul className="space-y-4">
                                <SpecItem label="Ranking Curve" desc="Uses a non-linear CTR model (27% for Pos 1, 0.1% for Pos 50-100)." />
                                <SpecItem label="DA Multiplier" desc="Authority scales impressions-per-page from 0.5x (DA < 10) to 2.0x (DA > 70)." />
                                <SpecItem label="Indexing Pulse" desc="Simulates crawl-budget cycles where indexation rate peaks at month 12 (95%)." />
                            </ul>
                        </div>
                        <div className="glass p-8 rounded-3xl border border-white/5 bg-black/40">
                            <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-6 opacity-40">Mathematical Constants</h4>
                            <code className="text-[10px] font-mono leading-relaxed text-blue-300 block bg-zinc-950 p-4 rounded-xl border border-white/5">
                                growthFactor = (1 - exp(-(0.12 + DA * 0.006) * m)) <br /><br />
                                impressions = indexedPages * baseImpsPerPage * growthFactor <br /><br />
                                value = ((clicks / 300) * avgCpc) + ((clicks / 1000) * avgCpm)
                            </code>
                        </div>
                    </div>
                </section>

                {/* Engine 2: GSC Ad Value */}
                <section className="space-y-12">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                            <Globe className="text-emerald-400 w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tight">2. GSC Ad Monetization</h3>
                    </div>
                    <div className="space-y-8">
                        <p className="text-zinc-400 leading-relaxed">
                            This engine calculates the <strong>In-Pocket Value</strong> of your organic traffic. It answers the question: "How much would it cost to buy this level of traffic from Google Ads?"
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FeatureCard icon={<Zap className="text-emerald-400" />} title="Blended Yield" desc="Calculates value using both CPC (per click) and CPM (per 1,000 visits), allowing for hybrid monetization models." />
                            <FeatureCard icon={<Target className="text-amber-400" />} title="AI Suppression" desc="Simulates the 20% traffic loss typically observed from SGE and AI Overviews." />
                            <FeatureCard icon={<TrendingUp className="text-blue-400" />} title="Visit Calibration" desc="Fine-tune revenue forecasts by adjusting Average CPM based on visitor quality and ad-density." />
                        </div>
                    </div>
                </section>

                {/* Engine 3: Ecommerce Revenue */}
                <section className="space-y-12">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                            <ShoppingBag className="text-indigo-400 w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tight">3. Ecommerce Revenue Engine</h3>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                A high-precision funnel model that converts search clicks into tangible revenue. It uses <strong>Monte Carlo Variations</strong> to account for the uncertainty in conversion rates.
                            </p>
                            <div className="space-y-4">
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">The CVR Stack</h5>
                                <CVRStep label="Base Store Trust" value="0.5% - 4.5%" />
                                <CVRStep label="Intent Multiplier" value="0.3x (Info) - 1.5x (Trans)" />
                                <CVRStep label="Mobile Adjustment" value="-20% Penalty (Optional)" />
                                <CVRStep label="CRO Learning" value="+20% over 24 months" />
                            </div>
                        </div>
                        <div className="glass p-10 rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-indigo-500/5 to-transparent">
                            <h4 className="font-black text-xs uppercase tracking-widest mb-8 opacity-40">Funnel Drop-off Benchmarks</h4>
                            <div className="space-y-6">
                                <FunnelItem label="Add to Cart" pct="8%" desc="Standard Ecommerce ATC rate." />
                                <FunnelItem label="Initiate Checkout" pct="60%" desc="Percentage of ATC that starts checkout." />
                                <FunnelItem label="Purchase Completion" pct="55%" desc="Percentage of Checkout that converts." />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Joint Impact */}
                <section className="glass rounded-[3rem] p-12 border border-white/10 bg-zinc-900/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.05]"><TrendingUp className="w-48 h-48" /></div>
                    <div className="relative z-10 space-y-8">
                        <div className="flex items-center gap-4">
                            <ShieldCheck className="text-purple-400 w-8 h-8" />
                            <h3 className="text-2xl font-black uppercase tracking-tight">Project Quality Parameters</h3>
                        </div>
                        <p className="text-zinc-400 max-w-2xl leading-relaxed">
                            These variables represent <strong>Global Modifiers</strong> that impact both ranking power (traffic) and the psychological trust (monetization) of your visitors.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div>
                                <h5 className="font-bold mb-3">Brand Strength</h5>
                                <p className="text-zinc-500 text-xs leading-relaxed">
                                    Impacts SERP Click-Through Rates (CTR) by up to 1.6x and Conversion Rates (CVR) by up to 1.8x. Elite brands capture significantly more value from the same search volume.
                                </p>
                            </div>
                            <div>
                                <h5 className="font-bold mb-3">Page Speed (CWV)</h5>
                                <p className="text-zinc-500 text-xs leading-relaxed">
                                    Influences the Baseline Impression score (+15% for scores {'>'}90) and reduces checkout drop-off rates on mobile devices.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* API Access */}
                <section className="space-y-12">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                            <Activity className="text-zinc-400 w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tight">Enterprise JSON API</h3>
                    </div>
                    <div className="space-y-8">
                        <p className="text-zinc-400 leading-relaxed">
                            Integrate the Quant engine directly into your custom dashboards or BI tools via our stateless JSON endpoints.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="glass p-8 rounded-3xl border border-white/5 bg-zinc-950/50">
                                <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 text-emerald-400">GSC Simulation</h4>
                                <code className="text-[9px] font-mono text-zinc-500 break-all">POST /api/simulate/gsc</code>
                            </div>
                            <div className="glass p-8 rounded-3xl border border-white/5 bg-zinc-950/50">
                                <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 text-indigo-400">Ecom Simulation</h4>
                                <code className="text-[9px] font-mono text-zinc-500 break-all">POST /api/simulate/ecom</code>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer Link */}
                <footer className="pt-20 border-t border-white/5 flex justify-center">
                    <Link href="/" className="bg-white text-black px-12 py-5 rounded-3xl font-black uppercase text-[10px] tracking-[0.4em] hover:scale-105 active:scale-95 transition-all shadow-2xl">
                        Open Studio Interface
                    </Link>
                </footer>
            </main>
        </div>
    );
}

function SpecItem({ label, desc }: any) {
    return (
        <li className="flex gap-4">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
            <div>
                <span className="text-xs font-bold block text-zinc-200">{label}</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">{desc}</span>
            </div>
        </li>
    );
}

function FeatureCard({ icon, title, desc }: any) {
    return (
        <div className="glass p-6 rounded-2xl border border-white/5 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">{icon}</div>
            <h5 className="font-black text-[10px] uppercase tracking-widest">{title}</h5>
            <p className="text-zinc-500 text-[10px] leading-relaxed font-medium">{desc}</p>
        </div>
    );
}

function CVRStep({ label, value }: any) {
    return (
        <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/5">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{label}</span>
            <span className="font-mono font-black text-indigo-400 text-xs">{value}</span>
        </div>
    );
}

function FunnelItem({ label, pct, desc }: any) {
    return (
        <div className="flex justify-between gap-6">
            <div className="space-y-1">
                <span className="text-xs font-black text-zinc-100 uppercase tracking-tight">{label}</span>
                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{desc}</p>
            </div>
            <div className="text-right">
                <span className="text-xl font-black text-indigo-400">{pct}</span>
            </div>
        </div>
    );
}
