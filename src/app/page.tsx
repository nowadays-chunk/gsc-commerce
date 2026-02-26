import Calculator from "@/components/calculator";

export default function Home() {
    return (
        <main className="relative min-h-screen bg-[#09090b] overflow-hidden selection:bg-blue-500/30">
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
                <div className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] bg-indigo-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[20%] w-[30%] h-[30%] bg-purple-600/5 blur-[100px] rounded-full" />
            </div>

            <div className="relative z-10">
                <Calculator />
            </div>
        </main>
    );
}
