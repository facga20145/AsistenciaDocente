/**
 * Convención API (igual que el backend):
 * - fecha:     dd/mm/yyyy
 * - hora:      HH:mm
 * - fechaHora: dd/mm/yyyy HH:mm:ss
 */

export const FECHA_REGEX = /^(\d{2})\/(\d{2})\/(\d{4})$/;
export const HORA_REGEX = /^(\d{2}):(\d{2})(?::(\d{2}))?$/;

export function formatHora(timeStr: string | null | undefined): string {
  if (!timeStr) return '—';
  const match = timeStr.match(/(\d{2}:\d{2})/);
  return match ? match[1] : timeStr;
}

/** Muestra fecha dd/mm/yyyy como texto largo: "viernes, 28 de agosto de 2026" */
export function formatFecha(dateStr: string): string {
  const match = dateStr.match(FECHA_REGEX);
  if (match) {
    const [, d, m, y] = match;
    const date = new Date(Number(y), Number(m) - 1, Number(d));
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString('es-PE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
  }
  const date = new Date(dateStr.includes('T') ? dateStr : `${dateStr}T12:00:00`);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('es-PE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatFechaHora(fechaHora: string | null | undefined): string {
  if (!fechaHora) return '—';
  const match = fechaHora.match(FECHA_REGEX);
  if (match) return fechaHora;
  return formatHora(fechaHora);
}

export function horaAMinutos(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

export type Turno = 'MANANA' | 'TARDE' | 'NOCHE';

export function turnoActual(): Turno {
  const now = new Date();
  const min = now.getHours() * 60 + now.getMinutes();
  if (min < 12 * 60) return 'MANANA';
  if (min < 18 * 60) return 'TARDE';
  return 'NOCHE';
}

export function turnoDeSesion(horaInicio: string): Turno {
  const min = horaAMinutos(horaInicio.slice(0, 5));
  if (min < 12 * 60) return 'MANANA';
  if (min < 18 * 60) return 'TARDE';
  return 'NOCHE';
}

export const TURNO_LABELS: Record<Turno, string> = {
  MANANA: 'Mañana',
  TARDE: 'Tarde',
  NOCHE: 'Noche',
};

export function calcularRetraso(
  horaInicioProgramada: string,
  horaEntradaReal: string | null,
): string | null {
  if (!horaEntradaReal) return null;
  const base = horaAMinutos(horaInicioProgramada.slice(0, 5));
  const realMatch = horaEntradaReal.match(/(\d{2}):(\d{2})/);
  if (!realMatch) return null;
  const real = Number(realMatch[1]) * 60 + Number(realMatch[2]);
  const diffMin = real - base;
  if (diffMin <= 0) return null;
  return `+${diffMin} min de retraso`;
}

/** Para inputs de formulario CRUD */
export function hoyFormato(): string {
  const n = new Date();
  const d = String(n.getDate()).padStart(2, '0');
  const m = String(n.getMonth() + 1).padStart(2, '0');
  return `${d}/${m}/${n.getFullYear()}`;
}

/** true si aún no pasó la hora de fin programada */
export function claseAunEnHorario(horaFinProgramada: string, ahora = new Date()): boolean {
  const finMin = horaAMinutos(horaFinProgramada.slice(0, 5));
  const ahoraMin = ahora.getHours() * 60 + ahora.getMinutes();
  return ahoraMin < finMin;
}

export function formatMinutosTrabajados(minutos: number | null | undefined): string | null {
  if (minutos == null || minutos <= 0) return null;
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  if (h === 0) return `${m} min`;
  return `${h}h ${m}min`;
}
