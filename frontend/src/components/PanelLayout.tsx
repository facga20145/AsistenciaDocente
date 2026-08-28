import { useEffect, useState } from 'react';
import { Clock, GraduationCap } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';

const NAV = [
  { to: '/panel/sesiones', label: 'Sesiones' },
  { to: '/panel/docentes', label: 'Docentes' },
  { to: '/panel/cursos', label: 'Cursos' },
  { to: '/panel/aulas', label: 'Aulas' },
  { to: '/panel/horarios', label: 'Horarios' },
];

export default function PanelLayout() {
  const [ahora, setAhora] = useState(new Date());

  useEffect(() => {
    const tick = setInterval(() => setAhora(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
      <header className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-900/50">
              <GraduationCap size={20} />
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight">Panel operativo</h1>
              <p className="text-xs text-slate-500">Administración y asistencia</p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-xl border border-slate-700/50 bg-slate-800/60 px-4 py-2 sm:flex">
            <Clock size={14} className="text-indigo-400" />
            <span className="font-mono text-sm text-slate-300">
              {ahora.toLocaleTimeString('es-PE', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </span>
          </div>

          <Link to="/" className="text-xs text-slate-500 underline hover:text-slate-300">
            Pantalla TV →
          </Link>
        </div>

        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 pb-3 sm:px-6">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <Outlet />
    </div>
  );
}
