/**
 * PantallaTV — vista pública de solo lectura para monitor/TV.
 * Muestra turnos, KPIs y tabla de sesiones sin botones de acción.
 */

import { useEffect, useMemo, useState } from 'react';
import { Clock, GraduationCap, Loader2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

import { EstadoBadge } from '../components/EstadoBadge';
import { useSesionesHoy } from '../hooks/useSesionesHoy';
import { EstadoSesion, type SesionClaseResponse } from '../types';
import {
  TURNO_LABELS,
  formatFecha,
  formatHora,
  hoyFormato,
  turnoDeSesion,
  turnoActual,
  type Turno,
} from '../utils/format';

const TURNOS: Turno[] = ['MANANA', 'TARDE', 'NOCHE'];

function contarAsistencias(sesiones: SesionClaseResponse[]) {
  return sesiones.filter(
    (s) =>
      s.estado === EstadoSesion.INICIADA ||
      s.estado === EstadoSesion.FINALIZADA,
  ).length;
}

export default function PantallaTV() {
  const { sesiones, loading, error, cargarSesiones, pollIntervalMs } = useSesionesHoy();
  const [turno, setTurno] = useState<Turno>(turnoActual);
  const [ahora, setAhora] = useState(new Date());

  useEffect(() => {
    const tick = setInterval(() => setAhora(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  const sesionesTurno = useMemo(
    () => sesiones.filter((s) => turnoDeSesion(s.horaInicioProgramada) === turno),
    [sesiones, turno],
  );

  const fechaHoy = sesiones[0]?.fecha ?? hoyFormato();

  const stats = {
    asistencias: contarAsistencias(sesionesTurno),
    tardanzas: sesionesTurno.filter((s) => s.estado === EstadoSesion.TARDANZA).length,
    faltas: sesionesTurno.filter((s) => s.estado === EstadoSesion.AUSENTE).length,
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-zinc-800 bg-black/90 px-6 py-4">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-700">
              <GraduationCap size={22} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-wide">Asistencia Docente</h1>
              <p className="text-xs text-zinc-500">Pantalla pública</p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-2xl text-zinc-200">
            <Clock size={22} className="text-rose-400" />
            {ahora.toLocaleTimeString('es-PE', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true,
            })}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-6 py-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-3 flex gap-2">
              {TURNOS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTurno(t)}
                  className={`rounded-lg px-5 py-2 text-sm font-semibold transition-all ${
                    turno === t
                      ? 'bg-rose-700 text-white shadow-lg shadow-rose-900/40'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white'
                  }`}
                >
                  {TURNO_LABELS[t]}
                </button>
              ))}
            </div>
            <p className="capitalize text-zinc-400">{formatFecha(fechaHoy)}</p>
          </div>

          <Link
            to="/panel"
            className="text-xs text-zinc-600 underline hover:text-zinc-400"
          >
            Ir al panel operativo →
          </Link>
        </div>

        <div className="mb-8 grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 text-center">
            <p className="text-5xl font-bold text-emerald-400">{stats.asistencias}</p>
            <p className="mt-2 text-sm uppercase tracking-wider text-zinc-500">Asistencias</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 text-center">
            <p className="text-5xl font-bold text-amber-400">{stats.tardanzas}</p>
            <p className="mt-2 text-sm uppercase tracking-wider text-zinc-500">Tardanzas</p>
          </div>
          <div className="rounded-xl border border-red-900/50 bg-zinc-950 p-6 text-center">
            <p className="text-5xl font-bold text-red-400">{stats.faltas}</p>
            <p className="mt-2 text-sm uppercase tracking-wider text-zinc-500">Faltas</p>
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center py-24">
            <Loader2 size={40} className="animate-spin text-rose-500" />
            <p className="mt-4 text-zinc-500">Cargando sesiones…</p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-900/50 bg-red-950/30 px-6 py-10 text-center">
            <XCircle size={36} className="mx-auto mb-3 text-red-500" />
            <p className="text-red-300">{error}</p>
            <button
              onClick={() => cargarSesiones()}
              className="mt-4 rounded-lg bg-red-800 px-4 py-2 text-sm font-semibold"
            >
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-hidden rounded-xl border border-zinc-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-900 text-xs uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-5 py-4">Horario Clase</th>
                  <th className="px-5 py-4">Docente</th>
                  <th className="px-5 py-4">Aula</th>
                  <th className="px-5 py-4">Curso</th>
                  <th className="px-5 py-4">Estado</th>
                  <th className="px-5 py-4">Hora entrada / salida</th>
                </tr>
              </thead>
              <tbody>
                {sesionesTurno.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center text-zinc-600">
                      No hay clases programadas para el turno {TURNO_LABELS[turno].toLowerCase()}
                    </td>
                  </tr>
                ) : (
                  sesionesTurno.map((s) => (
                    <tr
                      key={s.id}
                      className="border-t border-zinc-800/80 bg-zinc-950/50 hover:bg-zinc-900/50"
                    >
                      <td className="px-5 py-4 font-mono text-zinc-300">
                        {formatHora(s.horaInicioProgramada)} – {formatHora(s.horaFinProgramada)}
                      </td>
                      <td className="px-5 py-4 font-medium uppercase text-zinc-200">
                        {s.docente.apellidos} {s.docente.nombres}
                      </td>
                      <td className="px-5 py-4 text-zinc-400">{s.aula.nombre}</td>
                      <td className="px-5 py-4 text-zinc-300">{s.curso.nombre}</td>
                      <td className="px-5 py-4">
                        <EstadoBadge estado={s.estado} large />
                      </td>
                      <td className="px-5 py-4 font-mono text-zinc-400">
                        {s.horaEntradaReal ? formatHora(s.horaEntradaReal) : '—'}
                        {' / '}
                        {s.horaSalidaReal ? formatHora(s.horaSalidaReal) : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-4 text-right text-xs text-zinc-700">
          Actualización automática cada {pollIntervalMs / 1000}s · estados calculados en cada consulta
        </p>
      </main>
    </div>
  );
}
