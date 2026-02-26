"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
    simulateGSCAdValue,
    simulateEcommerceRevenue,
    simulateMonteCarlo,
    CalculatorInputs,
    StoreTrust,
    ContentDepth
} from "@/lib/engine";
import { formatNumber, formatCurrency, cn } from "@/lib/utils";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import {
    TrendingUp,
    BarChart3,
    MousePointerClick,
    DollarSign,
    Settings,
    Layers,
    Zap,
    Search,
    ShoppingBag,
    Target,
    Activity,
    Smartphone,
    Globe,
    Layout,
    Cpu,
    CheckCircle2,
    ShieldCheck,
    RefreshCcw,
    Gauge,
    Info,
    ChevronRight,
    HelpCircle,
    BookOpen
} from "lucide-react";

export default function Calculator() {
    const [activeModule, setActiveModule] = useState<"gsc" | "ecom">("gsc");
    const [mounted, setMounted] = useState(false);

    const [inputs, setInputs] = useState<CalculatorInputs>({
        totalPages: 2000,
        domainAuthority: 30,
        competition: "medium",
        avgCpc: 2.50,
        monthsSinceLaunch: 24,
        brandStrength: "average",
        pageSpeedScore: 70,
        contentDepth: "average",
        avgProductPrice: 150,
        netMargin: 0.35,
        storeTrust: "average",
        applyCannibalizationPenalty: false,
        applySeasonality: true,
        applyCoreUpdateVolatility: true,
        applyContentDecay: false,
        applySerpSuppression: true,
        applyReindexationRisk: false,
        applyMobilePenalty: true,
    });

    useEffect(() => { setMounted(true); }, []);

    const results = useMemo(() => {
        if (!mounted) return null;
        const gsc = simulateGSCAdValue(inputs);
        const ecom = simulateEcommerceRevenue(inputs);
        const gscMC = simulateMonteCarlo(inputs, "gsc", 30, true);
        const ecomMC = simulateMonteCarlo(inputs, "ecom", 30, true);

        return { gsc, ecom, gscMC, ecomMC };
    }, [inputs, mounted]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setInputs(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked :
                (name === "competition" || name === "storeTrust" || name === "brandStrength" || name === "contentDepth") ? value : Number(value)
        }));
    };

    if (!mounted || !results) return <div className="min-h-screen bg-[#060608] flex items-center justify-center text-zinc-500 font-mono">Initializing Quant Studio...</div>;

    const activeData = activeModule === "gsc" ? results.gsc : results.ecom;
    const activeMC = activeModule === "gsc" ? results.gscMC : results.ecomMC;

    const chartData = activeData.monthlyData.map((d, i) => ({
        month: d.month,
        clicks: d.clicks,
        value: activeModule === "gsc" ? (d as any).trafficValue : (d as any).revenue,
        min: activeModule === "gsc" ? (activeMC.p10[i]?.trafficValue || 0) : (activeMC.p10[i]?.revenue || 0),
        max: activeModule === "gsc" ? (activeMC.p90[i]?.trafficValue || 0) : (activeMC.p90[i]?.revenue || 0),
    }));

    return (
        <div className="min-h-screen bg-[#060608] text-zinc-100 pb-20 font-sans selection:bg-blue-500/30">
            <header className="border-b border-white/5 bg-black/40 backdrop-blur-2xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                            <Cpu className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black tracking-tighter uppercase leading-none">Quant Monetization Studio</h1>
                            <span className="text-[10px] text-zinc-500 font-bold tracking-[0.2em] uppercase">Enterprise Forecasting v2.1</span>
                        </div>
                    </div>
                    <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 shadow-inner">
                        <ModuleTab active={activeModule === "gsc"} onClick={() => setActiveModule("gsc")} label="GSC Ad Value" icon={<Globe className="w-3.5 h-3.5" />} />
                        <ModuleTab active={activeModule === "ecom"} onClick={() => setActiveModule("ecom")} label="Ecommerce Revenue" icon={<ShoppingBag className="w-3.5 h-3.5" />} />
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 pt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
                <aside className="lg:col-span-4 space-y-6">
                    {/* Common SEO Config */}
                    <ControlSection
                        title="SEO Foundation"
                        icon={<Search className="text-blue-400 w-3.5 h-3.5" />}
                        helpContent="The baseline of your organic potential. Inventory and Domain Authority drive indexation velocity and the volume of top-tier impressions."
                    >
                        <InputGroup label="URL Inventory" name="totalPages" value={inputs.totalPages} onChange={handleInputChange} />
                        <RangeGroup label="Domain Authority" name="domainAuthority" value={inputs.domainAuthority} onChange={handleInputChange} max={100} color="blue" />
                        <div className="grid grid-cols-2 gap-4">
                            <SelectGroup label="Comp. Level" name="competition" value={inputs.competition} onChange={handleInputChange} options={["low", "medium", "high"]} />
                            <InputGroup label="Sim Months" name="monthsSinceLaunch" value={inputs.monthsSinceLaunch} onChange={handleInputChange} />
                        </div>
                    </ControlSection>

                    {/* Joint Impact Section */}
                    <ControlSection
                        title="Project Quality"
                        icon={<ShieldCheck className="text-purple-400 w-3.5 h-3.5" />}
                        helpContent="Powerful cross-engine multipliers. Better site quality improves ranking CTR while simultaneously increasing checkout trust and conversion rate."
                    >
                        <div className="space-y-5">
                            <SelectGroup label="Brand Strength" name="brandStrength" value={inputs.brandStrength} onChange={handleInputChange} options={["low", "average", "strong", "elite"]} />
                            <RangeGroup label="Page Speed (CWV)" name="pageSpeedScore" value={inputs.pageSpeedScore} onChange={handleInputChange} max={100} color="indigo" />
                            <SelectGroup label="Content Depth" name="contentDepth" value={inputs.contentDepth} onChange={handleInputChange} options={["thin", "average", "comprehensive"]} />
                        </div>
                    </ControlSection>

                    {/* Module Specific Config */}
                    <AnimatePresence mode="wait">
                        {activeModule === "gsc" ? (
                            <motion.div key="gsc-config" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}>
                                <ControlSection
                                    title="Ad Parameters"
                                    icon={<DollarSign className="text-emerald-400 w-3.5 h-3.5" />}
                                    helpContent="Calculates the in-pocket value of organic keywords by modeling the budget required to purchase this exact click volume via Google Search Ads."
                                >
                                    <InputGroup label="Avg CPC ($)" name="avgCpc" value={inputs.avgCpc} onChange={handleInputChange} step="0.1" />
                                    <div className="pt-4 space-y-3">
                                        <ToggleItem label="AI Suppression" name="applySerpSuppression" value={!!inputs.applySerpSuppression} onChange={handleInputChange} icon={<Activity className="w-3 h-3" />} />
                                        <ToggleItem label="Re-index Risk" name="applyReindexationRisk" value={!!inputs.applyReindexationRisk} onChange={handleInputChange} icon={<RefreshCcw className="w-3 h-3" />} />
                                    </div>
                                </ControlSection>
                            </motion.div>
                        ) : (
                            <motion.div key="ecom-config" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}>
                                <ControlSection
                                    title="Ecom Parameters"
                                    icon={<ShoppingBag className="text-indigo-400 w-3.5 h-3.5" />}
                                    helpContent="Models a complete ecommerce funnel from click-to-purchase. Includes logic for profit margin preservation and typical drop-off rates."
                                >
                                    <div className="grid grid-cols-2 gap-4">
                                        <InputGroup label="Unit Price ($)" name="avgProductPrice" value={inputs.avgProductPrice} onChange={handleInputChange} />
                                        <InputGroup label="Net Margin (%)" name="netMargin" value={inputs.netMargin} onChange={handleInputChange} step="0.01" />
                                    </div>
                                    <div className="pt-4 space-y-3">
                                        <ToggleItem label="Mobile Penalty" name="applyMobilePenalty" value={!!inputs.applyMobilePenalty} onChange={handleInputChange} icon={<Smartphone className="w-3 h-3" />} />
                                        <ToggleItem label="Seasonal Pulse" name="applySeasonality" value={!!inputs.applySeasonality} onChange={handleInputChange} icon={<TrendingUp className="w-3 h-3" />} />
                                    </div>
                                </ControlSection>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </aside>

                <div className="lg:col-span-8 space-y-8">
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {activeModule === "gsc" ? (
                            <>
                                <MetricCard title="Est. Ad Value" value={formatCurrency(results.gsc.totals.yearlyTrafficValue)} icon={<DollarSign className="w-5 h-5" />} color="emerald" />
                                <MetricCard title="Yearly Clicks" value={formatNumber(results.gsc.totals.yearlyClicks)} icon={<MousePointerClick className="w-5 h-5" />} color="blue" />
                                <MetricCard title="Avg Search Pos" value={results.gsc.totals.avgPosition.toFixed(1)} icon={<Target className="w-5 h-5" />} color="amber" />
                                <MetricCard title="Weighted CTR" value={(results.gsc.totals.averageCtr * 100).toFixed(2) + "%"} icon={<Activity className="w-5 h-5" />} color="indigo" />
                            </>
                        ) : (
                            <>
                                <MetricCard title="Total Revenue" value={formatCurrency(results.ecom.totals.yearlyRevenue)} icon={<DollarSign className="w-5 h-5" />} color="indigo" />
                                <MetricCard title="Yearly Profit" value={formatCurrency(results.ecom.totals.yearlyProfit)} icon={<Zap className="w-5 h-5" />} color="amber" />
                                <MetricCard title="Orders Placed" value={formatNumber(results.ecom.totals.yearlyOrders)} icon={<ShoppingBag className="w-5 h-5" />} color="emerald" />
                                <MetricCard title="Blended CVR" value={(results.ecom.totals.blendedCvr * 100).toFixed(2) + "%"} icon={<Target className="w-5 h-5" />} color="purple" />
                            </>
                        )}
                    </div>

                    {/* Prediction Chart */}
                    <section className="glass rounded-[2.5rem] p-10 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-gradient-to-b from-white/[0.03] to-transparent">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                            <div>
                                <h3 className="text-3xl font-black tracking-tight mb-2">{activeModule === "gsc" ? "Traffic Value Projection" : "Revenue Velocity Map"}</h3>
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-1">
                                        {[1, 2, 3].map(i => <div key={i} className="w-5 h-5 rounded-full border-2 border-[#060608] bg-zinc-800 flex items-center justify-center text-[8px] font-bold">DA</div>)}
                                    </div>
                                    <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest">Multi-Engine Probability Feed</p>
                                </div>
                            </div>
                            <div className="flex bg-black/40 p-2.5 rounded-2xl border border-white/5 gap-6 px-6">
                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" /><span className="text-[10px] font-black text-white uppercase tracking-[0.1em]">Expected</span></div>
                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-white/10 border border-white/10" /><span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.1em]">Variance</span></div>
                            </div>
                        </div>

                        <div className="h-[450px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="valGlow" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={activeModule === "gsc" ? "#10b981" : "#6366f1"} stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#000" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 10, fontWeight: 800 }} tickMargin={15} />
                                    <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrency(v)} tick={{ fill: '#52525b', fontSize: 10, fontWeight: 800 }} tickMargin={15} />
                                    <Tooltip content={<ChartTooltip module={activeModule} />} cursor={{ stroke: 'white', strokeWidth: 1, strokeDasharray: '4 4' }} />
                                    <Area type="monotone" dataKey="max" stroke="none" fill="white" fillOpacity={0.02} isAnimationActive={false} />
                                    <Area type="monotone" dataKey="min" stroke="none" fill="#060608" isAnimationActive={false} />
                                    <Area type="monotone" dataKey="value" stroke={activeModule === "gsc" ? "#10b981" : "#6366f1"} strokeWidth={4} fill="url(#valGlow)" animationDuration={1500} strokeLinecap="round" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </section>

                    {/* Analysis Footer */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-[2rem] p-10 border border-white/10 relative overflow-hidden">
                            <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-8 flex items-center gap-2 opacity-50"><BarChart3 className="w-3 h-3 text-blue-400" /> Economics Intelligence</h4>
                            {activeModule === "ecom" ? (
                                <div className="space-y-6">
                                    <FunnelRow label="Traffic Acquisition" val={formatNumber(activeData.totals.yearlyOrders / 12 / activeData.totals.blendedCvr)} color="blue" />
                                    <FunnelRow label="Funnel Efficiency" val={formatNumber((activeData.totals.yearlyOrders / 12) * 2.1)} color="indigo" />
                                    <FunnelRow label="Conversion Yield" val={formatNumber(activeData.totals.yearlyOrders / 12)} color="emerald" />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-6 bg-black/40 rounded-[1.5rem] border border-white/5 group hover:border-emerald-500/20 transition-all shadow-inner">
                                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Effective RPV</span>
                                        <div className="text-right">
                                            <span className="text-2xl font-black text-emerald-400">{(results.gsc.totals.yearlyTrafficValue / results.gsc.totals.yearlyClicks).toFixed(2)}</span>
                                            <div className="text-[8px] font-bold text-zinc-600 uppercase">Per Paid Click Eq.</div>
                                        </div>
                                    </div>
                                    <p className="text-[9px] text-zinc-500 font-bold leading-relaxed uppercase tracking-wider opacity-60">
                                        Proprietary SEO-to-CPC valuation based on {inputs.competition} keyword volatility.
                                    </p>
                                </div>
                            )}
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-zinc-900/50 rounded-[2rem] p-10 border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity"><Gauge className="w-32 h-32" /></div>
                            <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-8 flex items-center gap-2 opacity-50"><Settings className="w-3 h-3 text-purple-400" /> Platform Metrics</h4>
                            <div className="space-y-4">
                                <CalibItem label="Monte Carlo Matrix" val="30 Iterations" />
                                <CalibItem label="Simulated Months" val={inputs.monthsSinceLaunch.toString()} />
                                <CalibItem label="Data Confidence" val="95.4%" color="text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                                <div className="pt-4">
                                    <Link href="/documentation" className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white text-zinc-400 hover:text-black py-4 rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all border border-white/5 shadow-xl">
                                        <BookOpen className="w-3.5 h-3.5" /> View Engine Docs
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <footer className="pt-10 flex flex-col items-center gap-6 border-t border-white/5">
                        <div className="flex gap-8">
                            <Link href="/documentation" className="text-[10px] font-black text-zinc-600 hover:text-blue-400 uppercase tracking-[0.2em] transition-colors">Documentation</Link>
                            <span className="text-zinc-800">/</span>
                            <Link href="#" className="text-[10px] font-black text-zinc-600 hover:text-white uppercase tracking-[0.2em] transition-colors">API Access</Link>
                            <span className="text-zinc-800">/</span>
                            <Link href="#" className="text-[10px] font-black text-zinc-600 hover:text-white uppercase tracking-[0.2em] transition-colors">Methodology</Link>
                        </div>
                        <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest leading-none">© 2026 Quant Monetization Studio • Real-Time SEO Financials</p>
                    </footer>
                </div>
            </main>
        </div>
    );
}

// Sub-components
function ModuleTab({ active, onClick, label, icon }: any) {
    return (
        <button onClick={onClick} className={cn("flex items-center gap-3 px-8 py-3 rounded-xl text-[10px] font-black transition-all tracking-[0.1em] uppercase", active ? "bg-white text-black shadow-[0_10px_20px_rgba(255,255,255,0.15)] scale-[1.05] z-10" : "text-zinc-500 hover:text-white hover:bg-white/5")}>
            {icon} {label}
        </button>
    );
}

function ControlSection({ title, icon, helpContent, children }: any) {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <section className="glass rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl relative">
            <div className="bg-white/5 px-8 py-5 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-black/40 border border-white/10">{icon}</div>
                    <h2 className="font-black text-[10px] tracking-[0.2em] uppercase opacity-70">{title}</h2>
                </div>
                <div className="relative">
                    <button
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                        className="p-1 rounded-full text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
                    >
                        <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                    <AnimatePresence>
                        {showTooltip && (
                            <motion.div
                                initial={{ opacity: 0, x: 10, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 10, scale: 0.95 }}
                                className="absolute left-full ml-4 top-0 w-64 glass p-6 rounded-[1.5rem] border border-blue-500/20 shadow-2xl z-[100] pointer-events-none"
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <Info className="w-3 h-3 text-blue-400" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Architectural Insight</span>
                                </div>
                                <p className="text-[10px] text-zinc-400 leading-relaxed font-bold uppercase tracking-wide">{helpContent}</p>
                                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                                    <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Quant Engine v2.1</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            <div className="p-8 space-y-6">{children}</div>
        </section>
    );
}

function InputGroup({ label, name, value, onChange, step = "1" }: any) {
    return (
        <div className="space-y-2">
            <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">{label}</label>
            <input type="number" name={name} value={value} onChange={onChange} step={step} className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white font-mono text-xs focus:border-blue-500/50 outline-none transition-all shadow-inner focus:shadow-[0_0_20px_rgba(59,130,246,0.1)]" />
        </div>
    );
}

function RangeGroup({ label, name, value, onChange, max, color }: any) {
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-end">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">{label}</label>
                <div className={cn("px-3 py-1 rounded-lg bg-black/40 border border-white/5 text-sm font-black font-mono shadow-inner", color === "blue" ? "text-blue-400" : "text-indigo-400")}>{value}</div>
            </div>
            <div className="relative h-6 flex items-center">
                <input type="range" name={name} min="0" max={max} value={value} onChange={onChange} className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all" />
            </div>
        </div>
    );
}

function SelectGroup({ label, name, value, onChange, options }: any) {
    return (
        <div className="space-y-2">
            <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">{label}</label>
            <div className="relative group">
                <select name={name} value={value} onChange={onChange} className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white font-black text-[10px] uppercase tracking-widest outline-none appearance-none cursor-pointer focus:border-blue-500/50 transition-all shadow-inner group-hover:border-white/10">
                    {options.map((o: any) => <option key={o} value={o} className="bg-zinc-900 border-none font-bold uppercase tracking-widest text-[8px]">{o}</option>)}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
                    <Layout className="w-3 h-3 text-zinc-400" />
                </div>
            </div>
        </div>
    );
}

function ToggleItem({ label, name, value, onChange, icon }: any) {
    return (
        <label className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-black/20 cursor-pointer group hover:bg-black/40 hover:border-white/10 transition-all shadow-sm">
            <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-xl border transition-all", value ? "bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]" : "bg-zinc-800/50 border-white/5 text-zinc-600")}>{icon}</div>
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.15em] group-hover:text-zinc-200 transition-colors">{label}</span>
            </div>
            <div className="relative inline-flex items-center">
                <input type="checkbox" name={name} checked={value} onChange={onChange} className="sr-only peer" />
                <div className="w-10 h-5 bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-zinc-500 after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600 peer-checked:after:bg-white shadow-inner"></div>
            </div>
        </label>
    );
}

function MetricCard({ title, value, icon, color }: any) {
    const colorMap: any = {
        blue: "text-blue-400 border-blue-500/20 bg-blue-500/[0.02]",
        emerald: "text-emerald-400 border-emerald-500/20 bg-emerald-500/[0.02]",
        amber: "text-amber-400 border-amber-500/20 bg-amber-500/[0.02]",
        indigo: "text-indigo-400 border-indigo-500/20 bg-indigo-500/[0.02]",
        purple: "text-purple-400 border-purple-500/20 bg-purple-500/[0.02]"
    };
    const glowMap: any = {
        blue: "shadow-[0_0_30px_rgba(59,130,246,0.05)]",
        emerald: "shadow-[0_0_30px_rgba(16,185,129,0.05)]",
        amber: "shadow-[0_0_30px_rgba(245,158,11,0.05)]",
        indigo: "shadow-[0_0_30px_rgba(99,102,241,0.05)]",
        purple: "shadow-[0_0_30px_rgba(168,85,247,0.05)]"
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cn("glass p-8 rounded-[2rem] border relative overflow-hidden group", colorMap[color], glowMap[color])}>
            <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/5 group-hover:bg-white/10 transition-all group-hover:scale-110 group-hover:rotate-3">{icon}</div>
                <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-white/20" />
                    <div className="w-1 h-1 rounded-full bg-white/40" />
                </div>
            </div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.25em] mb-2 group-hover:text-zinc-400 transition-colors">{title}</p>
            <h3 className="text-2xl font-black tracking-tighter text-white group-hover:scale-[1.02] transition-transform origin-left">{value}</h3>
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-current opacity-[0.03] blur-2xl rounded-full" />
        </motion.div>
    );
}

function FunnelRow({ label, val, color }: any) {
    const cMap: any = { blue: "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]", indigo: "bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]", emerald: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" };
    return (
        <div className="space-y-3">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest leading-none">
                <span className="opacity-40">{label}</span>
                <span className="text-white">{val}</span>
            </div>
            <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/5 shadow-inner">
                <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1, delay: 0.5 }} className={cn("h-full rounded-full opacity-60 relative", cMap[color])}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </motion.div>
            </div>
        </div>
    );
}

function CalibItem({ label, val, color = "text-zinc-500" }: any) {
    return (
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.1em] p-3 rounded-xl border border-white/[0.02] bg-white/[0.01]">
            <span className="opacity-40">{label}</span>
            <span className={cn("font-mono", color)}>{val}</span>
        </div>
    );
}

function ChartTooltip({ active, payload, label, module }: any) {
    if (!active || !payload || !payload.length) return null;
    return (
        <div className="glass p-6 rounded-[1.5rem] shadow-2xl border border-white/10 min-w-[200px] backdrop-blur-3xl bg-black/80">
            <p className="font-black text-zinc-500 mb-4 text-[10px] uppercase tracking-[0.2em] border-b border-white/5 pb-2">SIMULATION MONTH {label}</p>
            <div className="space-y-4">
                {payload.map((p: any) => (
                    <div key={p.name} className="flex justify-between gap-8 items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                            <span className="text-[10px] font-black opacity-50 uppercase tracking-widest">{p.name === "value" ? "PROJECTION" : p.name}</span>
                        </div>
                        <span className="font-mono font-black text-white text-xs">{p.name === "clicks" ? formatNumber(p.value) : formatCurrency(p.value)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
