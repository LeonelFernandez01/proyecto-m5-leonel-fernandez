export default function Spinner({ message = "Cargando..." }: { message?: string }) {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 py-8">
      {/* Premium glowing spinner */}
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 border-r-indigo-400 animate-spin shadow-indigo-500/20 shadow-md"></div>
      </div>
      
      <p className="text-slate-400 font-semibold text-xs tracking-widest uppercase animate-pulse-soft">{message}</p>
    </div>
  );
}