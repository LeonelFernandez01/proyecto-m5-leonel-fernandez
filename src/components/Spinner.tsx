export default function Spinner({ message = "Cargando..." }: { message?: string }) {
  return (
    <div className="min-h-[50vh] w-full flex flex-col items-center justify-center gap-3">
      {/* El circulito que gira */}
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      {/* El texto opcional */}
      <p className="text-gray-500 font-medium text-sm tracking-wide">{message}</p>
    </div>
  );
}