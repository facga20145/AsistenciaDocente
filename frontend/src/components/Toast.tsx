export function Toast({ msg }: { msg: { text: string; type: 'ok' | 'error' } | null }) {
  if (!msg) return null;
  return (
    <div
      className={`fixed right-5 top-5 z-50 max-w-sm rounded-xl border px-4 py-3 text-sm font-medium shadow-2xl ${
        msg.type === 'ok'
          ? 'border-emerald-700 bg-emerald-900/90 text-emerald-100'
          : 'border-red-700 bg-red-900/90 text-red-100'
      }`}
    >
      {msg.text}
    </div>
  );
}
