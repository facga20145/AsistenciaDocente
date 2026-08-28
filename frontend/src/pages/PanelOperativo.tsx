/**
 * PanelOperativo — vista de acciones para docentes/administradores.
 * Permite iniciar/finalizar clases y disparar tareas manuales de desarrollo.
 */

import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  GraduationCap,
  Loader2,
  MapPin,
  PlayCircle,
  RefreshCw,
  User,
  XCircle,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { sesionApi } from '../api';
import { EstadoBadge } from '../components/EstadoBadge';
import { useSesionesHoy } from '../hooks/useSesionesHoy';
import { EstadoSesion, type SesionClaseResponse } from '../types';
import { calcularRetraso, claseAunEnHorario, formatFecha, formatHora, formatMinutosTrabajados, hoyFormato } from '../utils/format';

function SesionCard({
  sesion,
  onIniciar,
  onFinalizar,
  loadingId,
}: {
  sesion: SesionClaseResponse;
  onIniciar: (id: number) => void;
  onFinalizar: (id: number) => void;
  loadingId: number | null;
}) {
  const isLoading = loadingId === sesion.id;
  const esAusente = sesion.estado === EstadoSesion.AUSENTE;
  const enHorario = claseAunEnHorario(sesion.horaFinProgramada);
  const canIniciar =
    enHorario &&
    (sesion.estado === EstadoSesion.PROGRAMADA ||
      sesion.estado === EstadoSesion.TARDANZA ||
      esAusente);
  const canFinalizar = sesion.estado === EstadoSesion.INICIADA;
  const claseTerminadaSinEntrada =
    esAusente && !enHorario && !sesion.horaEntradaReal;
  const retraso = calcularRetraso(sesion.horaInicioProgramada, sesion.horaEntradaReal);
  const horasTrabajadas = formatMinutosTrabajados(sesion.minutosTrabajados);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-slate-800/60 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:shadow-2xl ${
        sesion.estado === EstadoSesion.INICIADA
          ? 'border-emerald-600/60 shadow-lg shadow-emerald-900/30'
          : 'border-slate-700/60'
      } ${sesion.estado === EstadoSesion.AUSENTE && !sesion.horaEntradaReal ? 'opacity-90' : ''}`}
    >
      <div className="p-4 pl-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-indigo-700/50 bg-indigo-900/70">
              <User size={16} className="text-indigo-300" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold leading-tight text-white">
                {sesion.docente.nombres} {sesion.docente.apellidos}
              </p>
              <p className="truncate text-xs text-slate-400">ID #{sesion.docente.id}</p>
            </div>
          </div>
          <EstadoBadge estado={sesion.estado} />
        </div>

        <div className="mb-2 flex items-center gap-1.5">
          <BookOpen size={13} className="flex-shrink-0 text-indigo-400" />
          <span className="truncate text-sm font-medium text-slate-300">{sesion.curso.nombre}</span>
        </div>

        <div className="mb-4 flex items-center gap-1.5">
          <MapPin size={13} className="flex-shrink-0 text-violet-400" />
          <span className="text-sm text-slate-400">{sesion.aula.nombre}</span>
        </div>

        <div className="mb-3 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-slate-600/40 bg-slate-700/50 p-2.5">
            <p className="mb-0.5 text-xs uppercase tracking-wide text-slate-500">Programado</p>
            <p className="font-mono text-sm text-slate-300">
              {formatHora(sesion.horaInicioProgramada)} — {formatHora(sesion.horaFinProgramada)}
            </p>
          </div>
          <div className="rounded-xl border border-slate-600/40 bg-slate-700/50 p-2.5">
            <p className="mb-0.5 text-xs uppercase tracking-wide text-slate-500">Real</p>
            <p className="font-mono text-sm text-slate-300">
              {sesion.horaEntradaReal ? (
                <>
                  {formatHora(sesion.horaEntradaReal)}
                  {sesion.horaSalidaReal && (
                    <> — {formatHora(sesion.horaSalidaReal)}</>
                  )}
                </>
              ) : (
                <span className="text-slate-600">No iniciada</span>
              )}
            </p>
          </div>
        </div>

        {retraso && (
          <div className="mb-3 flex items-center gap-1.5 rounded-lg border border-amber-800/40 bg-amber-900/30 px-3 py-1.5">
            <AlertTriangle size={13} className="flex-shrink-0 text-amber-400" />
            <span className="text-xs text-amber-300">{retraso}</span>
          </div>
        )}

        {horasTrabajadas && (
          <div className="mb-3 flex items-center gap-1.5 rounded-lg border border-blue-800/40 bg-blue-900/30 px-3 py-1.5">
            <CheckCircle2 size={13} className="flex-shrink-0 text-blue-400" />
            <span className="text-xs text-blue-300">Tiempo dictado: {horasTrabajadas}</span>
          </div>
        )}

        {claseTerminadaSinEntrada && (
          <div className="mb-3 rounded-lg border border-red-800/40 bg-red-900/20 px-3 py-2 text-xs text-red-300">
            Clase finalizada — no se puede registrar entrada
          </div>
        )}

        {(canIniciar || canFinalizar) && (
          <div className="mt-1 flex gap-2">
            {canIniciar && (
              <button
                onClick={() => onIniciar(sesion.id)}
                disabled={isLoading}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/30 transition-all hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? <Loader2 size={15} className="animate-spin" /> : <PlayCircle size={15} />}
                {esAusente ? 'Registrar llegada' : 'Iniciar clase'}
              </button>
            )}
            {canFinalizar && (
              <button
                onClick={() => onFinalizar(sesion.id)}
                disabled={isLoading}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
                Finalizar clase
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PanelOperativo() {
  const { sesiones, loading, error, cargarSesiones, pollIntervalMs } = useSesionesHoy();
  const [loadingAction, setLoadingAction] = useState<number | null>(null);
  const [generando, setGenerando] = useState(false);
  const [marcando, setMarcando] = useState(false);
  const [actionMsg, setActionMsg] = useState<{ text: string; type: 'ok' | 'error' } | null>(null);
  const [ahora, setAhora] = useState(new Date());

  useEffect(() => {
    const tick = setInterval(() => setAhora(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  const showMsg = (text: string, type: 'ok' | 'error') => {
    setActionMsg({ text, type });
    setTimeout(() => setActionMsg(null), 3500);
  };

  const handleIniciar = async (id: number) => {
    setLoadingAction(id);
    try {
      const updated = await sesionApi.iniciar(id);
      await cargarSesiones(true);
      const nombre = updated.docente
        ? `${updated.docente.nombres} ${updated.docente.apellidos}`
        : 'Docente';
      showMsg(`Entrada registrada — ${nombre} (${formatHora(updated.horaEntradaReal)})`, 'ok');
    } catch (e) {
      showMsg((e as Error).message, 'error');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleFinalizar = async (id: number) => {
    setLoadingAction(id);
    try {
      await sesionApi.finalizar(id);
      await cargarSesiones(true);
      showMsg('Clase finalizada correctamente', 'ok');
    } catch (e) {
      showMsg((e as Error).message, 'error');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleGenerar = async () => {
    setGenerando(true);
    try {
      await sesionApi.generarDelDia();
      await cargarSesiones();
      showMsg('Sesiones del día generadas', 'ok');
    } catch (e) {
      showMsg((e as Error).message, 'error');
    } finally {
      setGenerando(false);
    }
  };

  const handleMarcar = async () => {
    setMarcando(true);
    try {
      await sesionApi.marcarAusentesTardanzas();
      await cargarSesiones();
      showMsg('Tardanzas y ausentes actualizados', 'ok');
    } catch (e) {
      showMsg((e as Error).message, 'error');
    } finally {
      setMarcando(false);
    }
  };

  const fechaHoy = sesiones[0]?.fecha ?? hoyFormato();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
      {actionMsg && (
        <div
          className={`fixed right-5 top-5 z-50 max-w-xs rounded-xl border px-4 py-3 text-sm font-medium shadow-2xl ${
            actionMsg.type === 'ok'
              ? 'border-emerald-700 bg-emerald-900/90 text-emerald-100'
              : 'border-red-700 bg-red-900/90 text-red-100'
          }`}
        >
          {actionMsg.text}
        </div>
      )}

      <header className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-900/50">
              <GraduationCap size={20} />
            </div>
            <div>
              <h1 className="text-base font-bold leading-tight">Panel operativo</h1>
              <p className="text-xs leading-tight text-slate-500">Iniciar / finalizar clases</p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-xl border border-slate-700/50 bg-slate-800/60 px-4 py-2 sm:flex">
            <Clock size={14} className="text-indigo-400" />
            <span className="font-mono text-sm text-slate-300">
              {ahora.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerar}
              disabled={generando}
              title="Solo desarrollo — en producción corre a medianoche"
              className="flex items-center gap-1.5 rounded-xl bg-indigo-700 px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-indigo-600 disabled:opacity-50"
            >
              {generando ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
              <span className="hidden sm:inline">Generar</span>
            </button>
            <button
              onClick={handleMarcar}
              disabled={marcando}
              title="Forzar recálculo de tardanzas/ausentes"
              className="flex items-center gap-1.5 rounded-xl bg-amber-700 px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-amber-600 disabled:opacity-50"
            >
              {marcando ? <Loader2 size={14} className="animate-spin" /> : <AlertTriangle size={14} />}
              <span className="hidden sm:inline">Marcar</span>
            </button>
            <button
              onClick={() => cargarSesiones()}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-xl bg-slate-700 px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-slate-600 disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-indigo-400" />
            <h2 className="text-sm capitalize text-slate-400">{formatFecha(fechaHoy)}</h2>
          </div>
          <Link to="/" className="ml-auto text-xs text-slate-600 underline hover:text-slate-400">
            ← Ir a pantalla TV
          </Link>
          <span className="w-full text-xs text-slate-600 sm:w-auto sm:ml-0">
            Actualización cada {pollIntervalMs / 1000}s · estados automáticos al consultar
          </span>
        </div>

        {loading && (
          <div className="flex flex-col items-center py-24">
            <Loader2 size={36} className="animate-spin text-indigo-500" />
            <p className="mt-4 text-sm text-slate-500">Cargando sesiones…</p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-800/50 bg-red-900/20 px-6 py-8 text-center">
            <XCircle size={40} className="mx-auto mb-3 text-red-500" />
            <p className="mb-4 font-semibold text-red-300">{error}</p>
            <button
              onClick={() => cargarSesiones()}
              className="rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold text-white"
            >
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && sesiones.length === 0 && (
          <div className="flex flex-col items-center py-24">
            <Calendar size={40} className="text-slate-700" />
            <p className="mt-3 text-sm text-slate-500">
              No hay sesiones para hoy. Usa Generar (dev) o espera al cron de medianoche.
            </p>
          </div>
        )}

        {!loading && !error && sesiones.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sesiones.map((sesion) => (
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
