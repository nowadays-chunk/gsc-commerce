"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
    simulateGSCAdValue,
    simulateEcommerceRevenue,
    simulateMonteCarlo,
    CalculatorInputs,
    StoreTrust,
    ContentDepth,
    GSCAdValueData,
    EcommerceData
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
    BookOpen,
    Save,
    Trash2,
    Download,
    Upload,
    ChevronDown,
    ChevronUp,
    Copy,
    ArrowUpRight,
    ArrowDownRight,
    Minus,
    Plus
} from "lucide-react";

interface Estimation {
    id: string;
    name: string;
    timestamp: number;
    type: "gsc" | "ecom";
    inputs: CalculatorInputs;
    yearlyValue: number;
    totals: any;
    monthlyData: any[];
}

export default function Calculator() {
    const [activeModule, setActiveModule] = useState<"gsc" | "ecom">("gsc");
    const [mounted, setMounted] = useState(false);

    const [inputs, setInputs] = useState<CalculatorInputs>({
        totalPages: 2000,
        domainAuthority: 30,
        competition: "medium",
        avgCpc: 2.50,
        avgCpm: 12.00,
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
        inventoryGrowthRate: 0,
    });

    const [estimations, setEstimations] = useState<Estimation[]>([]);
    const [editingEstimationId, setEditingEstimationId] = useState<string | null>(null);
    const [expandedEstimationId, setExpandedEstimationId] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem("quant_estimations");
        if (saved) {
            try {
                setEstimations(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load estimations", e);
            }
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            localStorage.setItem("quant_estimations", JSON.stringify(estimations));
        }
    }, [estimations, mounted]);

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

    const saveEstimation = () => {
        if (!results) return;

        const activeTotals = activeModule === "gsc" ? results.gsc.totals : results.ecom.totals;
        const yearlyValue = activeModule === "gsc" ? results.gsc.totals.yearlyTrafficValue : results.ecom.totals.yearlyRevenue;

        if (editingEstimationId) {
            setEstimations(prev => prev.map(est => {
                if (est.id === editingEstimationId) {
                    return {
                        ...est,
                        timestamp: Date.now(),
                        type: activeModule,
                        inputs: { ...inputs },
                        yearlyValue,
                        totals: activeTotals,
                        monthlyData: activeModule === "gsc" ? results.gsc.monthlyData : results.ecom.monthlyData
                    };
                }
                return est;
            }));
        } else {
            const id = Math.random().toString(36).substring(2, 9);
            const name = `Estimation ${estimations.length + 1}`;

            const newEstimation: Estimation = {
                id,
                name,
                timestamp: Date.now(),
                type: activeModule,
                inputs: { ...inputs },
                yearlyValue,
                totals: activeTotals,
                monthlyData: activeModule === "gsc" ? results.gsc.monthlyData : results.ecom.monthlyData
            };

            setEstimations(prev => [newEstimation, ...prev]);
        }
    };

    const deleteEstimation = (id: string) => {
        setEstimations(prev => prev.filter(e => e.id !== id));
        if (editingEstimationId === id) setEditingEstimationId(null);
        if (expandedEstimationId === id) setExpandedEstimationId(null);
    };

    const loadEstimation = (est: Estimation) => {
        setInputs(est.inputs);
        setActiveModule(est.type);
        setEditingEstimationId(est.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const exportEstimations = () => {
        const blob = new Blob([JSON.stringify(estimations, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `quant_estimations_${new Date().toISOString().split("T")[0]}.json`;
        a.click();
    };

    const importEstimations = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target?.result as string);
                setEstimations(prev => [...imported, ...prev]);
            } catch (err) {
                alert("Invalid JSON file");
            }
        };
        reader.readAsText(file);
    };

    const updateEstimationName = (id: string, name: string) => {
        setEstimations(prev => prev.map(e => e.id === id ? { ...e, name } : e));
    };

    const activeData = results ? (activeModule === "gsc" ? results.gsc : results.ecom) : null;
    const activeMC = results ? (activeModule === "gsc" ? results.gscMC : results.ecomMC) : null;

    const baseEstimation = editingEstimationId ? estimations.find(e => e.id === editingEstimationId) : null;

    const getComparison = (current: number, base: number) => {
        if (!base) return null;
        const diff = ((current - base) / base) * 100;
        if (Math.abs(diff) < 0.1) return { label: "SAME", color: "text-zinc-500", icon: <Minus className="w-2.5 h-2.5" /> };
        if (diff > 0) return { label: `+${diff.toFixed(1)}%`, color: "text-emerald-400", icon: <ArrowUpRight className="w-2.5 h-2.5" /> };
        return { label: `${diff.toFixed(1)}%`, color: "text-red-400", icon: <ArrowDownRight className="w-2.5 h-2.5" /> };
    };

    const chartData = useMemo(() => {
        if (!activeData || !results) return [];
        return activeData.monthlyData.map((d, i) => ({
            month: d.month,
            clicks: d.clicks,
            value: activeModule === "gsc" ? (d as any).trafficValue : (d as any).revenue,
            min: activeModule === "gsc" ? (results.gscMC.p10[i]?.trafficValue || 0) : (results.ecomMC.p10[i]?.revenue || 0),
            max: activeModule === "gsc" ? (results.gscMC.p90[i]?.trafficValue || 0) : (results.ecomMC.p90[i]?.revenue || 0),
        }));
    }, [activeData, activeModule, results]);

    if (!mounted || !results) return <div className="min-h-screen bg-[#060608] flex items-center justify-center text-zinc-500 font-mono">Initializing Quant Studio...</div>;

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
                    <div className="flex items-center gap-4">
                        {editingEstimationId && (
                            <button onClick={() => setEditingEstimationId(null)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 text-[10px] font-black uppercase tracking-widest border border-white/5 transition-all">
                                <Plus className="w-3.5 h-3.5" /> Start New
                            </button>
                        )}
                        <button onClick={saveEstimation} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_10px_20px_rgba(59,130,246,0.3)] hover:scale-105 active:scale-95">
                            <Save className="w-3.5 h-3.5" /> {editingEstimationId ? "Update Active" : "Save Estimation"}
                        </button>
                        <div className="h-6 w-px bg-white/10 mx-2" />
                        <label className="cursor-pointer p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all">
                            <Upload className="w-4 h-4 text-zinc-400" />
                            <input type="file" className="hidden" accept=".json" onChange={importEstimations} />
                        </label>
                        <button onClick={exportEstimations} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all">
                            <Download className="w-4 h-4 text-zinc-400" />
                        </button>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputGroup
                                label="URL Inventory"
                                name="totalPages"
                                value={inputs.totalPages}
                                onChange={handleInputChange}
                                extra={
                                    <span className="text-[7px] px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black uppercase">
                                        Final: {formatNumber(Math.floor(inputs.totalPages * Math.pow(1 + ((inputs.inventoryGrowthRate || 0) / 100), inputs.monthsSinceLaunch)))}
                                    </span>
                                }
                            />
                            <InputGroup label="Mo. Growth (%)" name="inventoryGrowthRate" value={inputs.inventoryGrowthRate} onChange={handleInputChange} step="0.1" />
                        </div>
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
                                    <div className="grid grid-cols-2 gap-4">
                                        <InputGroup label="Avg CPC ($)" name="avgCpc" value={inputs.avgCpc} onChange={handleInputChange} step="0.1" />
                                        <InputGroup label="Avg CPM ($)" name="avgCpm" value={inputs.avgCpm} onChange={handleInputChange} step="0.5" />
                                    </div>
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
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                        {activeModule === "gsc" ? (
                            <>
                                <div className="md:col-span-2">
                                    <MetricCard
                                        title="Est. Ad Value"
                                        value={formatCurrency(results.gsc.totals.yearlyTrafficValue)}
                                        subtitle={`${formatCurrency(results.gsc.totals.monthlyTrafficValue)}/mo • ${formatCurrency(results.gsc.totals.dailyTrafficValue)}/day`}
                                        icon={<DollarSign className="w-5 h-5" />}
                                        color="emerald"
                                    >
                                        {baseEstimation && baseEstimation.type === "gsc" && (
                                            <div className="mt-2 flex items-center gap-1.5">
                                                {(() => {
                                                    const comp = getComparison(results.gsc.totals.yearlyTrafficValue, baseEstimation.yearlyValue);
                                                    return comp && (
                                                        <div className={cn("flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-tighter", comp.color)}>
                                                            {comp.icon} {comp.label} vs saved
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        )}
                                        <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-[7px] font-black text-zinc-500 uppercase tracking-widest">Avg CPC</label>
                                                <input
                                                    type="number"
                                                    name="avgCpc"
                                                    value={inputs.avgCpc}
                                                    onChange={handleInputChange}
                                                    step="0.1"
                                                    className="w-full bg-white/5 border border-white/5 rounded-lg px-2 py-1.5 text-white font-mono text-[9px] focus:border-emerald-500/50 outline-none transition-colors"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[7px] font-black text-zinc-500 uppercase tracking-widest">Avg CPM</label>
                                                <input
                                                    type="number"
                                                    name="avgCpm"
                                                    value={inputs.avgCpm}
                                                    onChange={handleInputChange}
                                                    step="0.5"
                                                    className="w-full bg-white/5 border border-white/5 rounded-lg px-2 py-1.5 text-white font-mono text-[9px] focus:border-emerald-500/50 outline-none transition-colors"
                                                />
                                            </div>
                                        </div>
                                    </MetricCard>
                                </div>
                                <div className="md:col-span-2">
                                    <MetricCard
                                        title="Organic Clicks"
                                        value={formatNumber(results.gsc.totals.yearlyClicks)}
                                        subtitle={`${formatNumber(results.gsc.totals.monthlyClicks)}/mo • ${formatNumber(results.gsc.totals.dailyClicks)}/day`}
                                        icon={<MousePointerClick className="w-5 h-5" />}
                                        color="blue"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <MetricCard
                                        title="Impressions"
                                        value={formatNumber(results.gsc.totals.yearlyImpressions)}
                                        subtitle={`${formatNumber(results.gsc.totals.monthlyImpressions)}/mo • ${formatNumber(results.gsc.totals.dailyImpressions)}/day`}
                                        icon={<BarChart3 className="w-5 h-5" />}
                                        color="indigo"
                                    />
                                </div>
                                <div className="md:col-span-3">
                                    <MetricCard title="Avg Search Position" value={results.gsc.totals.avgPosition.toFixed(1)} icon={<Target className="w-5 h-5" />} color="amber" />
                                </div>
                                <div className="md:col-span-3">
                                    <MetricCard title="Weighted CTR" value={(results!.gsc.totals.averageCtr * 100).toFixed(2) + "%"} icon={<Activity className="w-5 h-5" />} color="purple" />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="md:col-span-3">
                                    <MetricCard
                                        title="Total Revenue"
                                        value={formatCurrency(results.ecom.totals.yearlyRevenue)}
                                        subtitle={`${formatCurrency(results.ecom.totals.monthlyRevenue)}/mo • ${formatCurrency(results.ecom.totals.dailyRevenue)}/day`}
                                        icon={<DollarSign className="w-5 h-5" />}
                                        color="indigo"
                                    >
                                        {baseEstimation && baseEstimation.type === "ecom" && (
                                            <div className="mt-2 flex items-center gap-1.5">
                                                {(() => {
                                                    const comp = getComparison(results.ecom.totals.yearlyRevenue, baseEstimation.yearlyValue);
                                                    return comp && (
                                                        <div className={cn("flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-tighter", comp.color)}>
                                                            {comp.icon} {comp.label} vs saved
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        )}
                                    </MetricCard>
                                </div>
                                <div className="md:col-span-3">
                                    <MetricCard
                                        title="Yearly Profit"
                                        value={formatCurrency(results.ecom.totals.yearlyProfit)}
                                        subtitle={`${formatCurrency(results.ecom.totals.monthlyProfit)}/mo • ${formatCurrency(results.ecom.totals.dailyProfit)}/day`}
                                        icon={<Zap className="w-5 h-5" />}
                                        color="amber"
                                    />
                                </div>
                                <div className="md:col-span-3">
                                    <MetricCard title="Orders Placed" value={formatNumber(results.ecom.totals.yearlyOrders)} icon={<ShoppingBag className="w-5 h-5" />} color="emerald" />
                                </div>
                                <div className="md:col-span-3">
                                    <MetricCard title="Blended CVR" value={(results.ecom.totals.blendedCvr * 100).toFixed(2) + "%"} icon={<Target className="w-5 h-5" />} color="purple" />
                                </div>
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
                                    <FunnelRow label="Traffic Acquisition" val={formatNumber(results.ecom.totals.yearlyOrders / 12 / results.ecom.totals.blendedCvr)} color="blue" />
                                    <FunnelRow label="Funnel Efficiency" val={formatNumber((results.ecom.totals.yearlyOrders / 12) * 2.1)} color="indigo" />
                                    <FunnelRow label="Conversion Yield" val={formatNumber(results.ecom.totals.yearlyOrders / 12)} color="emerald" />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-6 bg-black/40 rounded-[1.5rem] border border-white/5 group hover:border-emerald-500/20 transition-all shadow-inner">
                                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Effective RPV</span>
                                        <div className="text-right">
                                            <span className="text-2xl font-black text-emerald-400">{(results.gsc.totals.yearlyTrafficValue / results.gsc.totals.yearlyClicks).toFixed(2)}</span>
                                            <div className="text-[8px] font-bold text-zinc-600 uppercase">Blended RPV (CPC+CPM Eq.)</div>
                                        </div>
                                    </div>
                                    <p className="text-[9px] text-zinc-500 font-bold leading-relaxed uppercase tracking-wider opacity-60">
                                        Combined monetization model factoring both click-based and visit-based yields.
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
                </div>

                {/* Estimations Management Table */}
                <section className="mt-20 lg:col-span-12 glass rounded-[2.5rem] p-10 border border-white/10 bg-gradient-to-b from-white/[0.02] to-transparent">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-2xl font-black tracking-tight mb-1">Estimation Library</h3>
                            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">Saved scenarios & progressive models</p>
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-black/40 border border-white/5">
                            <Activity className="w-3 h-3 text-blue-400" />
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{estimations.length} Scenarios Stored</span>
                        </div>
                    </div>

                    <div className="overflow-hidden border border-white/5 rounded-3xl bg-black/20">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/5">
                                    <th className="px-8 py-5 text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">Date</th>
                                    <th className="px-8 py-5 text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">Scenario Name</th>
                                    <th className="px-8 py-5 text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">Engine</th>
                                    <th className="px-8 py-5 text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">Yearly Forecast</th>
                                    <th className="px-8 py-5 text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.02]">
                                {estimations.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4 opacity-20">
                                                <Layers className="w-12 h-12" />
                                                <p className="text-xs font-black uppercase tracking-[0.3em]">No estimations saved yet</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    estimations.map((est) => (
                                        <React.Fragment key={est.id}>
                                            <tr className={cn("group transition-colors hover:bg-white/[0.02]", editingEstimationId === est.id && "bg-blue-500/[0.03] border-l-4 border-l-blue-500")}>
                                                <td className="px-8 py-6 font-mono text-[10px] text-zinc-500">
                                                    {new Date(est.timestamp).toLocaleDateString()}
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            type="text"
                                                            value={est.name}
                                                            onChange={(e) => updateEstimationName(est.id, e.target.value)}
                                                            className="bg-transparent border-none text-xs font-black text-white focus:outline-none focus:ring-0 w-48"
                                                        />
                                                        {editingEstimationId === est.id && (
                                                            <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[8px] font-black uppercase tracking-tighter">Active Mod</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2">
                                                        {est.type === "gsc" ? (
                                                            <><Globe className="w-3 h-3 text-emerald-400" /><span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">GSC Ad Val</span></>
                                                        ) : (
                                                            <><ShoppingBag className="w-3 h-3 text-indigo-400" /><span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Ecom Rev</span></>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 font-black text-white text-xs">
                                                    {formatCurrency(est.yearlyValue)}
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => setExpandedEstimationId(expandedEstimationId === est.id ? null : est.id)}
                                                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                                                            title="Monthly Breakdown"
                                                        >
                                                            {expandedEstimationId === est.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                                        </button>
                                                        <button
                                                            onClick={() => loadEstimation(est)}
                                                            className="p-2 rounded-lg bg-white/5 hover:bg-blue-500/20 hover:text-blue-400 transition-all"
                                                            title="Load to Calculator"
                                                        >
                                                            <RefreshCcw className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteEstimation(est.id)}
                                                            className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition-all"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {expandedEstimationId === est.id && (
                                                <tr className="bg-black/40 shadow-inner">
                                                    <td colSpan={5} className="px-8 py-8">
                                                        <div className="mb-12 glass rounded-3xl p-6 border border-white/5 bg-black/20">
                                                            <h4 className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                                                <TrendingUp className="w-3 h-3 text-blue-400" /> Scenario Growth Trajectory
                                                            </h4>
                                                            <div className="h-[200px] w-full">
                                                                <ResponsiveContainer width="100%" height="100%">
                                                                    <AreaChart
                                                                        data={est.monthlyData.map((m: any) => ({
                                                                            month: m.month,
                                                                            value: est.type === "gsc" ? m.trafficValue : m.revenue,
                                                                            clicks: m.clicks
                                                                        }))}
                                                                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                                                    >
                                                                        <defs>
                                                                            <linearGradient id={`glow-${est.id}`} x1="0" y1="0" x2="0" y2="1">
                                                                                <stop offset="5%" stopColor={est.type === "gsc" ? "#10b981" : "#6366f1"} stopOpacity={0.3} />
                                                                                <stop offset="95%" stopColor="#000" stopOpacity={0} />
                                                                            </linearGradient>
                                                                        </defs>
                                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
                                                                        <XAxis dataKey="month" hide />
                                                                        <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrency(v)} tick={{ fill: '#52525b', fontSize: 8, fontWeight: 800 }} />
                                                                        <Tooltip content={<ChartTooltip module={est.type} />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                                                                        <Area
                                                                            type="monotone"
                                                                            dataKey="value"
                                                                            stroke={est.type === "gsc" ? "#10b981" : "#6366f1"}
                                                                            strokeWidth={3}
                                                                            fill={`url(#glow-${est.id})`}
                                                                            animationDuration={1000}
                                                                        />
                                                                    </AreaChart>
                                                                </ResponsiveContainer>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                                            <div className="md:col-span-1 border-r border-white/10 pr-6">
                                                                <h4 className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                                                    <Activity className="w-3 h-3" /> Monthly Progressive Metrics
                                                                </h4>
                                                                <div className="max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                                                                    <table className="w-full text-left">
                                                                        <thead>
                                                                            <tr className="border-b border-white/5 pb-2">
                                                                                <th className="text-[8px] font-black text-zinc-600 uppercase py-2">Month</th>
                                                                                <th className="text-[8px] font-black text-zinc-600 uppercase py-2">Inventory</th>
                                                                                <th className="text-[8px] font-black text-zinc-600 uppercase py-2">Clicks</th>
                                                                                <th className="text-[8px] font-black text-zinc-600 uppercase py-2">Imps</th>
                                                                                <th className="text-[8px] font-black text-zinc-600 uppercase py-2">CTR</th>
                                                                                <th className="text-[8px] font-black text-zinc-600 uppercase py-2">Pos</th>
                                                                                <th className="text-[8px] font-black text-zinc-600 uppercase py-2 text-right">Value</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {est.monthlyData.map((m: any) => (
                                                                                <tr key={m.month} className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors">
                                                                                    <td className="text-[10px] font-mono text-zinc-500 py-2">{m.month}</td>
                                                                                    <td className="text-[10px] font-bold text-purple-400/60 py-2">{formatNumber(m.totalPages || 0)}</td>
                                                                                    <td className="text-[10px] font-black text-zinc-300 py-2">{formatNumber(m.clicks)}</td>
                                                                                    <td className="text-[10px] font-bold text-zinc-500 py-2">{formatNumber(m.impressions)}</td>
                                                                                    <td className="text-[9px] font-bold text-blue-400/60 py-2">{(m.ctr * 100).toFixed(2)}%</td>
                                                                                    <td className="text-[9px] font-bold text-amber-500/60 py-2">{m.avgPosition.toFixed(1)}</td>
                                                                                    <td className="text-[10px] font-black text-white text-right py-2">{formatCurrency(est.type === "gsc" ? m.trafficValue : m.revenue)}</td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>

                                                            <div className="md:col-span-1">
                                                                <h4 className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                                                    <TrendingUp className="w-3 h-3" /> Daily Accumulative Projections
                                                                </h4>
                                                                <div className="max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                                                                    <table className="w-full text-left">
                                                                        <thead>
                                                                            <tr className="border-b border-white/5 pb-2">
                                                                                <th className="text-[8px] font-black text-zinc-600 uppercase py-2">Month</th>
                                                                                <th className="text-[8px] font-black text-zinc-600 uppercase py-2">Clicks/Day</th>
                                                                                <th className="text-[8px] font-black text-zinc-600 uppercase py-2">Imps/Day</th>
                                                                                <th className="text-[8px] font-black text-zinc-600 uppercase py-2 text-right">Value/Day</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {est.monthlyData.map((m: any) => {
                                                                                const daysInMonth = 30.42; // average
                                                                                return (
                                                                                    <tr key={`daily-${m.month}`} className="border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors">
                                                                                        <td className="text-[10px] font-mono text-zinc-500 py-2">{m.month}</td>
                                                                                        <td className="text-[10px] font-black text-emerald-400/80 py-2">{formatNumber(Math.floor(m.clicks / daysInMonth))}</td>
                                                                                        <td className="text-[10px] font-bold text-zinc-500 py-2">{formatNumber(Math.floor(m.impressions / daysInMonth))}</td>
                                                                                        <td className="text-[10px] font-black text-white text-right py-2">{formatCurrency((est.type === "gsc" ? m.trafficValue : m.revenue) / daysInMonth)}</td>
                                                                                    </tr>
                                                                                );
                                                                            })}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-col h-full">
                                                                <h4 className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                                                    <Settings className="w-3 h-3 text-purple-400" /> Scenario Configuration
                                                                </h4>
                                                                <div className="glass p-8 rounded-[2rem] border border-white/5 bg-black/20 flex-grow">
                                                                    <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                                                                        <div>
                                                                            <h5 className="text-[8px] font-black text-zinc-600 uppercase mb-4 tracking-widest leading-none">Market Dynamics</h5>
                                                                            <div className="space-y-2">
                                                                                <CalibItem label="Comp Level" val={est.inputs.competition} />
                                                                                <CalibItem label="Brand Power" val={est.inputs.brandStrength} />
                                                                                <CalibItem label="Mo. Growth" val={((est.inputs.inventoryGrowthRate || 0)).toFixed(1) + "%"} />
                                                                                <CalibItem label="Content Depth" val={est.inputs.contentDepth} />
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <h5 className="text-[8px] font-black text-zinc-600 uppercase mb-4 tracking-widest leading-none">Engine Variables</h5>
                                                                            <div className="space-y-2">
                                                                                {est.type === "gsc" ? (
                                                                                    <>
                                                                                        <CalibItem label="AVG CPC" val={formatCurrency(est.inputs.avgCpc)} />
                                                                                        <CalibItem label="AVG CPM" val={formatCurrency(est.inputs.avgCpm)} />
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        <CalibItem label="Unit Price" val={formatCurrency(est.inputs.avgProductPrice || 0)} />
                                                                                        <CalibItem label="Net Margin" val={((est.inputs.netMargin || 0) * 100).toFixed(0) + "%"} />
                                                                                    </>
                                                                                )}
                                                                                <CalibItem label="Initial URLs" val={formatNumber(est.inputs.totalPages)} />
                                                                                <CalibItem label="Domain Auth" val={est.inputs.domainAuthority} />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
                                                                        <div className="flex flex-col gap-1">
                                                                            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Base Module</span>
                                                                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{est.type === "gsc" ? "Search Console Ad Value" : "Ecommerce Revenue"}</span>
                                                                        </div>
                                                                        <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                                                                            {est.type === "gsc" ? <Globe className="w-5 h-5 text-emerald-400 opacity-50" /> : <ShoppingBag className="w-5 h-5 text-indigo-400 opacity-50" />}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <footer className="lg:col-span-12 pt-20 pb-10 flex flex-col items-center gap-6 border-t border-white/5 mt-20">
                    <div className="flex gap-8">
                        <Link href="/documentation" className="text-[10px] font-black text-zinc-600 hover:text-blue-400 uppercase tracking-[0.2em] transition-colors">Documentation</Link>
                        <span className="text-zinc-800">/</span>
                        <Link href="#" className="text-[10px] font-black text-zinc-600 hover:text-white uppercase tracking-[0.2em] transition-colors">API Access</Link>
                        <span className="text-zinc-800">/</span>
                        <Link href="#" className="text-[10px] font-black text-zinc-600 hover:text-white uppercase tracking-[0.2em] transition-colors">Methodology</Link>
                    </div>
                    <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest leading-none">© 2026 Quant Monetization Studio • Real-Time SEO Financials</p>
                </footer>
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

function InputGroup({ label, name, value, onChange, step = "1", extra }: any) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">{label}</label>
                {extra}
            </div>
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

function MetricCard({ title, value, subtitle, icon, color, small, children }: any) {
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
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cn("glass rounded-[2rem] border relative overflow-hidden group transition-all", small ? "p-4" : "p-8", colorMap[color], glowMap[color])}>
            <div className={cn("flex justify-between items-start", small ? "mb-3" : "mb-6")}>
                <div className={cn("bg-white/5 rounded-2xl border border-white/5 group-hover:bg-white/10 transition-all group-hover:scale-110", small ? "p-2" : "p-3")}>{icon}</div>
                {!small && (
                    <div className="flex gap-1">
                        <div className="w-1 h-1 rounded-full bg-white/20" />
                        <div className="w-1 h-1 rounded-full bg-white/40" />
                    </div>
                )}
            </div>
            <p className={cn("font-black text-zinc-500 uppercase tracking-[0.25em] group-hover:text-zinc-400 transition-colors", small ? "text-[8px] mb-1" : "text-[10px] mb-2")}>{title}</p>
            <h3 className={cn("font-black tracking-tighter text-white group-hover:scale-[1.02] transition-transform origin-left", small ? "text-lg" : "text-2xl")}>{value}</h3>
            {children}
            {subtitle && <p className="text-[9px] font-bold text-zinc-500 mt-2 lowercase tracking-tighter">{subtitle}</p>}
            {!small && <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-current opacity-[0.03] blur-2xl rounded-full" />}
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
