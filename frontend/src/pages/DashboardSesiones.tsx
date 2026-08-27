/**
 * DashboardSesiones.tsx
 * Vista principal del panel de control de asistencia docente.
 *
 * Funcionalidades:
 *  - Lista sesiones de hoy con polling automático cada 12 segundos
 *  - Permite marcar Inicio de clase (PROGRAMADA/TARDANZA → INICIADA)
 *  - Permite marcar Fin de clase (INICIADA → FINALIZADA)
 *  - Muestra badge de puntualidad según estado de la sesión
 *  - Botón para generar sesiones del día (idempotente)
 *  - Botón para marcar ausentes/tardanzas automáticamente
 *  - Filtro por estado de sesión
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import {
  Clock,
  PlayCircle,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Calendar,
  BookOpen,
  MapPin,
  User,
  RefreshCw,
  Zap,
  Loader2,
  GraduationCap,
  Activity,
} from 'lucide-react';

import { sesionApi } from '../api';
import {
  EstadoSesion,
  estadoToLabel,
  estadoToColor,
  type SesionClaseResponse,
} from '../types';

// ---------------------------------------------------------------------------
// Helpers de formato
// ---------------------------------------------------------------------------

function formatHora(timeStr: string | null | undefined): string {
  if (!timeStr) return '—';
  // El backend puede devolver 'HH:mm:ss' o ISO
  const match = timeStr.match(/(\d{2}:\d{2})/);
  return match ? match[1] : timeStr;
}

function formatFecha(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('es-PE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function calcularRetraso(
  horaInicioProgramada: string,
  horaEntradaReal: string | null,
): string | null {
  if (!horaEntradaReal) return null;
  const base = new Date('1970-01-01T' + horaInicioProgramada);
  const real = new Date('1970-01-01T' + horaEntradaReal.substring(11, 19));
  const diffMin = Math.round((real.getTime() - base.getTime()) / 60000);
  if (diffMin <= 0) return null;
  return `+${diffMin} min de retraso`;
}

// ---------------------------------------------------------------------------
// Sub-componente: Badge de estado
// ---------------------------------------------------------------------------

const ESTADO_ICONS: Record<EstadoSesion, React.ReactNode> = {
  [EstadoSesion.PROGRAMADA]: <Clock size={12} />,
  [EstadoSesion.INICIADA]: <Activity size={12} className="animate-pulse" />,
  [EstadoSesion.FINALIZADA]: <CheckCircle2 size={12} />,
  [EstadoSesion.TARDANZA]: <AlertTriangle size={12} />,
  [EstadoSesion.AUSENTE]: <XCircle size={12} />,
};

function EstadoBadge({ estado }: { estado: EstadoSesion }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${estadoToColor[estado]}`}
    >
      {ESTADO_ICONS[estado]}
      {estadoToLabel[estado]}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Sub-componente: Tarjeta de sesión
// ---------------------------------------------------------------------------

interface SesionCardProps {
  sesion: SesionClaseResponse;
  onIniciar: (id: number) => void;
  onFinalizar: (id: number) => void;
  loadingId: number | null;
}

function SesionCard({ sesion, onIniciar, onFinalizar, loadingId }: SesionCardProps) {
  const isLoading = loadingId === sesion.id;
  const canIniciar =
    sesion.estado === EstadoSesion.PROGRAMADA ||
    sesion.estado === EstadoSesion.TARDANZA;
  const canFinalizar = sesion.estado === EstadoSesion.INICIADA;

  const retraso = calcularRetraso(
    sesion.horaInicioProgramada,
    sesion.horaEntradaReal,
  );

  return (
    <div
      className={`relative rounded-2xl border bg-slate-800/60 backdrop-blur-md overflow-hidden
        transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5 group
        ${sesion.estado === EstadoSesion.INICIADA ? 'border-emerald-600/60 shadow-emerald-900/30 shadow-lg' : 'border-slate-700/60'}
        ${sesion.estado === EstadoSesion.AUSENTE ? 'opacity-75' : ''}
      `}
    >
      {/* Barra lateral de color por estado */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl transition-all
          ${sesion.estado === EstadoSesion.INICIADA ? 'bg-emerald-500' : ''}
          ${sesion.estado === EstadoSesion.FINALIZADA ? 'bg-blue-500' : ''}
          ${sesion.estado === EstadoSesion.TARDANZA ? 'bg-amber-500' : ''}
          ${sesion.estado === EstadoSesion.AUSENTE ? 'bg-red-500' : ''}
          ${sesion.estado === EstadoSesion.PROGRAMADA ? 'bg-slate-500' : ''}
        `}
      />

      <div className="pl-5 pr-5 pt-4 pb-4">
        {/* Header: docente + estado */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-indigo-900/70 border border-indigo-700/50 flex items-center justify-center">
              <User size={16} className="text-indigo-300" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-white text-sm truncate leading-tight">
                {sesion.docente.nombres} {sesion.docente.apellidos}
              </p>
              <p className="text-xs text-slate-400 truncate">ID #{sesion.docente.id}</p>
            </div>
          </div>
          <EstadoBadge estado={sesion.estado} />
        </div>

        {/* Curso */}
        <div className="flex items-center gap-1.5 mb-2">
          <BookOpen size={13} className="text-indigo-400 flex-shrink-0" />
          <span className="text-sm text-slate-300 font-medium truncate">
            {sesion.curso.nombre}
          </span>
        </div>

        {/* Aula */}
        <div className="flex items-center gap-1.5 mb-4">
          <MapPin size={13} className="text-violet-400 flex-shrink-0" />
          <span className="text-sm text-slate-400">{sesion.aula.nombre}</span>
        </div>

        {/* Horarios */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {/* Programado */}
          <div className="rounded-xl bg-slate-700/50 border border-slate-600/40 p-2.5">
            <p className="text-xs text-slate-500 mb-0.5 uppercase tracking-wide">Programado</p>
            <p className="text-sm font-mono text-slate-300">
              {formatHora(sesion.horaInicioProgramada)}
              <span className="text-slate-500 mx-1">—</span>
              {formatHora(sesion.horaFinProgramada)}
            </p>
          </div>

          {/* Real */}
          <div className="rounded-xl bg-slate-700/50 border border-slate-600/40 p-2.5">
            <p className="text-xs text-slate-500 mb-0.5 uppercase tracking-wide">Real</p>
            <p className="text-sm font-mono text-slate-300">
              {sesion.horaEntradaReal ? (
                <>
                  {formatHora(sesion.horaEntradaReal)}
                  {sesion.horaSalidaReal && (
                    <>
                      <span className="text-slate-500 mx-1">—</span>
                      {formatHora(sesion.horaSalidaReal)}
                    </>
                  )}
                </>
              ) : (
                <span className="text-slate-600">No iniciada</span>
              )}
            </p>
          </div>
        </div>

        {/* Indicador de retraso */}
        {retraso && (
          <div className="flex items-center gap-1.5 mb-3 bg-amber-900/30 border border-amber-800/40 rounded-lg px-3 py-1.5">
            <AlertTriangle size={13} className="text-amber-400 flex-shrink-0" />
            <span className="text-xs text-amber-300">{retraso}</span>
          </div>
        )}

        {/* Acciones */}
        {(canIniciar || canFinalizar) && (
          <div className="flex gap-2 mt-1">
            {canIniciar && (
              <button
                id={`btn-iniciar-${sesion.id}`}
                onClick={() => onIniciar(sesion.id)}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl
                  bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700
                  text-white text-sm font-semibold py-2.5 px-4
                  transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed
                  shadow-lg shadow-emerald-900/30"
              >
                {isLoading ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <PlayCircle size={15} />
                )}
                Iniciar clase
              </button>
            )}
            {canFinalizar && (
              <button
                id={`btn-finalizar-${sesion.id}`}
                onClick={() => onFinalizar(sesion.id)}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl
                  bg-blue-600 hover:bg-blue-500 active:bg-blue-700
                  text-white text-sm font-semibold py-2.5 px-4
                  transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed
                  shadow-lg shadow-blue-900/30"
              >
                {isLoading ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={15} />
                )}
                Finalizar clase
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-componente: Estadísticas de resumen
// ---------------------------------------------------------------------------

function StatsBar({ sesiones }: { sesiones: SesionClaseResponse[] }) {
  const counts = sesiones.reduce(
    (acc, s) => {
      acc[s.estado] = (acc[s.estado] ?? 0) + 1;
      return acc;
    },
    {} as Partial<Record<EstadoSesion, number>>,
  );

  const stats = [
    { label: 'Programadas', value: counts[EstadoSesion.PROGRAMADA] ?? 0, color: 'text-slate-400', bg: 'bg-slate-700/40' },
    { label: 'En curso', value: counts[EstadoSesion.INICIADA] ?? 0, color: 'text-emerald-400', bg: 'bg-emerald-900/30' },
    { label: 'Finalizadas', value: counts[EstadoSesion.FINALIZADA] ?? 0, color: 'text-blue-400', bg: 'bg-blue-900/30' },
    { label: 'Tardanzas', value: counts[EstadoSesion.TARDANZA] ?? 0, color: 'text-amber-400', bg: 'bg-amber-900/30' },
    { label: 'Ausentes', value: counts[EstadoSesion.AUSENTE] ?? 0, color: 'text-red-400', bg: 'bg-red-900/30' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
      {stats.map((s) => (
        <div
          key={s.label}
          className={`rounded-xl border border-slate-700/50 ${s.bg} px-4 py-3 text-center`}
        >
          <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

const POLL_INTERVAL_MS = 12_000;

const FILTROS: Array<{ label: string; value: EstadoSesion | 'TODAS' }> = [
  { label: 'Todas', value: 'TODAS' },
  { label: 'Programadas', value: EstadoSesion.PROGRAMADA },
  { label: 'En curso', value: EstadoSesion.INICIADA },
  { label: 'Finalizadas', value: EstadoSesion.FINALIZADA },
  { label: 'Tardanzas', value: EstadoSesion.TARDANZA },
  { label: 'Ausentes', value: EstadoSesion.AUSENTE },
];

export default function DashboardSesiones() {
  const [sesiones, setSesiones] = useState<SesionClaseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<number | null>(null);
  const [filtro, setFiltro] = useState<EstadoSesion | 'TODAS'>('TODAS');
  const [actionMsg, setActionMsg] = useState<{ text: string; type: 'ok' | 'error' } | null>(null);
  const [generando, setGenerando] = useState(false);
  const [marcando, setMarcando] = useState(false);
  const [ahora, setAhora] = useState(new Date());

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reloj en tiempo real
  useEffect(() => {
    const tick = setInterval(() => setAhora(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  // Función de carga principal
  const cargarSesiones = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const data = await sesionApi.listarHoy();
      setSesiones(data);
    } catch (e) {
      setError((e as Error).message ?? 'Error al cargar sesiones');
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  // Carga inicial + polling
  useEffect(() => {
    cargarSesiones();
    pollingRef.current = setInterval(() => cargarSesiones(true), POLL_INTERVAL_MS);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [cargarSesiones]);

  // Toast temporal
  const showMsg = (text: string, type: 'ok' | 'error') => {
    setActionMsg({ text, type });
    setTimeout(() => setActionMsg(null), 3500);
  };

  // Iniciar clase
  const handleIniciar = async (id: number) => {
    setLoadingAction(id);
    try {
      const updated = await sesionApi.iniciar(id);
      setSesiones((prev) =>
        prev.map((s) => (s.id === id ? updated : s)),
      );
      showMsg('✅ Clase iniciada correctamente', 'ok');
    } catch (e) {
      showMsg(`❌ ${(e as Error).message}`, 'error');
    } finally {
      setLoadingAction(null);
    }
  };

  // Finalizar clase
  const handleFinalizar = async (id: number) => {
    setLoadingAction(id);
    try {
      const updated = await sesionApi.finalizar(id);
      setSesiones((prev) =>
        prev.map((s) => (s.id === id ? updated : s)),
      );
      showMsg('✅ Clase finalizada correctamente', 'ok');
    } catch (e) {
      showMsg(`❌ ${(e as Error).message}`, 'error');
    } finally {
      setLoadingAction(null);
    }
  };

  // Generar sesiones del día
  const handleGenerar = async () => {
    setGenerando(true);
    try {
      await sesionApi.generarDelDia();
      await cargarSesiones();
      showMsg('✅ Sesiones del día generadas', 'ok');
    } catch (e) {
      showMsg(`❌ ${(e as Error).message}`, 'error');
    } finally {
      setGenerando(false);
    }
  };

  // Marcar ausentes y tardanzas
  const handleMarcar = async () => {
    setMarcando(true);
    try {
      await sesionApi.marcarAusentesTardanzas();
      await cargarSesiones();
      showMsg('✅ Ausentes y tardanzas marcados', 'ok');
    } catch (e) {
      showMsg(`❌ ${(e as Error).message}`, 'error');
    } finally {
      setMarcando(false);
    }
  };

  // Filtrar sesiones
  const sesionesFiltradas =
    filtro === 'TODAS'
      ? sesiones
      : sesiones.filter((s) => s.estado === filtro);

  const fechaHoy = sesiones[0]?.fecha ?? new Date().toISOString().slice(0, 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
      {/* Toast de acciones */}
      {actionMsg && (
        <div
          className={`fixed top-5 right-5 z-50 max-w-xs rounded-xl px-4 py-3 text-sm font-medium shadow-2xl border
            transition-all duration-300 animate-in slide-in-from-right
            ${actionMsg.type === 'ok'
              ? 'bg-emerald-900/90 border-emerald-700 text-emerald-100'
              : 'bg-red-900/90 border-red-700 text-red-100'
            }`}
        >
          {actionMsg.text}
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-900/50">
              <GraduationCap size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white leading-tight">
                Asistencia Docente
              </h1>
              <p className="text-xs text-slate-500 leading-tight">Panel de sesiones</p>
            </div>
          </div>

          {/* Reloj */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-2">
            <Clock size={14} className="text-indigo-400" />
            <span className="font-mono text-sm text-slate-300">
              {ahora.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>

          {/* Acciones globales */}
          <div className="flex items-center gap-2">
            <button
              id="btn-generar-sesiones"
              onClick={handleGenerar}
              disabled={generando}
              title="Generar sesiones del día"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-600
                text-white text-xs font-semibold transition-all disabled:opacity-50"
            >
              {generando ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
              <span className="hidden sm:inline">Generar</span>
            </button>

            <button
              id="btn-marcar-ausentes"
              onClick={handleMarcar}
              disabled={marcando}
              title="Marcar ausentes y tardanzas"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-700 hover:bg-amber-600
                text-white text-xs font-semibold transition-all disabled:opacity-50"
            >
              {marcando ? <Loader2 size={14} className="animate-spin" /> : <AlertTriangle size={14} />}
              <span className="hidden sm:inline">Marcar</span>
            </button>

            <button
              id="btn-refresh"
              onClick={() => cargarSesiones()}
              disabled={loading}
              title="Actualizar sesiones"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600
                text-white text-xs font-semibold transition-all disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Fecha */}
        <div className="flex items-center gap-2 mb-5">
          <Calendar size={16} className="text-indigo-400" />
          <h2 className="text-sm text-slate-400 capitalize">{formatFecha(fechaHoy)}</h2>
          <span className="ml-auto text-xs text-slate-600">
            Actualización automática cada {POLL_INTERVAL_MS / 1000}s
          </span>
        </div>

        {/* Stats */}
        {!loading && sesiones.length > 0 && <StatsBar sesiones={sesiones} />}

        {/* Filtros */}
        <div className="flex gap-2 flex-wrap mb-6">
          {FILTROS.map((f) => (
            <button
              key={f.value}
              id={`filtro-${f.value.toLowerCase()}`}
              onClick={() => setFiltro(f.value as EstadoSesion | 'TODAS')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all
                ${filtro === f.value
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/30'
                  : 'bg-slate-800/60 border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600'
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Estados de carga y error */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 size={36} className="text-indigo-500 animate-spin" />
            <p className="text-slate-500 text-sm">Cargando sesiones de hoy…</p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-800/50 bg-red-900/20 px-6 py-8 text-center">
            <XCircle size={40} className="text-red-500 mx-auto mb-3" />
            <p className="text-red-300 font-semibold mb-1">Error al cargar sesiones</p>
            <p className="text-red-400/70 text-sm mb-4">{error}</p>
            <button
              onClick={() => cargarSesiones()}
              className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white text-sm font-semibold transition-all"
            >
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && sesionesFiltradas.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Calendar size={40} className="text-slate-700" />
            <p className="text-slate-500 text-sm">
              {sesiones.length === 0
                ? 'No hay sesiones generadas para hoy. Usa el botón "Generar" para crearlas.'
                : 'No hay sesiones con el filtro seleccionado.'}
            </p>
          </div>
        )}

        {/* Grid de tarjetas */}
        {!loading && !error && sesionesFiltradas.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sesionesFiltradas.map((sesion) => (
              <SesionCard
                key={sesion.id}
                sesion={sesion}
                onIniciar={handleIniciar}
                onFinalizar={handleFinalizar}
                loadingId={loadingAction}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
