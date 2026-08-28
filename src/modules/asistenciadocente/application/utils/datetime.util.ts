/**
 * Convención API del proyecto:
 * - fecha:      dd/mm/yyyy   →  "28/08/2026"
 * - hora:       HH:mm        →  "09:00"
 * - fechaHora:  dd/mm/yyyy HH:mm:ss  →  "28/08/2026 09:15:30"
 *
 * En BD: @db.Date y @db.Time se manejan siempre vía UTC para evitar desfases.
 */

export const FECHA_REGEX = /^(\d{2})\/(\d{2})\/(\d{4})$/;
export const HORA_REGEX = /^(\d{2}):(\d{2})(?::(\d{2}))?$/;
export const FECHA_HORA_REGEX = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})$/;

export function parseHora(hora: string): Date {
  const match = hora.trim().match(HORA_REGEX);
  if (!match) {
    throw new Error('Formato de hora inválido. Use HH:mm (ej: 09:00)');
  }
  const h = Number(match[1]);
  const m = Number(match[2]);
  const s = Number(match[3] ?? 0);
  if (h > 23 || m > 59 || s > 59) {
    throw new Error('Hora fuera de rango');
  }
  return new Date(Date.UTC(1970, 0, 1, h, m, s));
}

export function formatHora(date: Date): string {
  const h = String(date.getUTCHours()).padStart(2, '0');
  const m = String(date.getUTCMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export function parseFecha(fecha: string): Date {
  const match = fecha.trim().match(FECHA_REGEX);
  if (!match) {
    throw new Error('Formato de fecha inválido. Use dd/mm/yyyy (ej: 28/08/2026)');
  }
  const d = Number(match[1]);
  const mo = Number(match[2]);
  const y = Number(match[3]);
  const date = new Date(Date.UTC(y, mo - 1, d));
  if (
    date.getUTCFullYear() !== y ||
    date.getUTCMonth() !== mo - 1 ||
    date.getUTCDate() !== d
  ) {
    throw new Error('Fecha inválida');
  }
  return date;
}

export function formatFecha(date: Date): string {
  const d = String(date.getUTCDate()).padStart(2, '0');
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const y = date.getUTCFullYear();
  return `${d}/${m}/${y}`;
}

export function formatFechaHora(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0');
  const mo = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  const h = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${d}/${mo}/${y} ${h}:${mi}:${s}`;
}

/** Fecha de hoy (calendario local) lista para guardar en @db.Date */
export function hoyParaDb(): Date {
  const n = new Date();
  return new Date(Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()));
}

/** Minutos de tolerancia tras la hora de inicio antes de marcar AUSENTE */
export const TOLERANCIA_TARDANZA_MIN = 30;

export const TOLERANCIA_TARDANZA_MS = TOLERANCIA_TARDANZA_MIN * 60_000;

export function msDesdeMedianocheLocal(fecha: Date): number {
  return (
    fecha.getHours() * 3_600_000 +
    fecha.getMinutes() * 60_000 +
    fecha.getSeconds() * 1_000
  );
}

/** Hora de campos @db.Time de Prisma (UTC sobre 1970-01-01) en ms */
export function msDesdeMedianochePrismaTime(fecha: Date): number {
  return (
    fecha.getUTCHours() * 3_600_000 +
    fecha.getUTCMinutes() * 60_000 +
    fecha.getUTCSeconds() * 1_000
  );
}

export function compararHoras(a: Date, b: Date): number {
  return msDesdeMedianochePrismaTime(a) - msDesdeMedianochePrismaTime(b);
}

/** true si aún no pasó la hora de fin programada de la clase */
export function claseAunEnHorario(horaFinProgramada: Date, ahora = new Date()): boolean {
  return msDesdeMedianocheLocal(ahora) < msDesdeMedianochePrismaTime(horaFinProgramada);
}

/** Minutos trabajados entre entrada y salida reales (null si falta alguna) */
export function calcularMinutosTrabajados(
  horaEntradaReal: Date | null,
  horaSalidaReal: Date | null,
): number | null {
  if (!horaEntradaReal || !horaSalidaReal) return null;
  const diff = horaSalidaReal.getTime() - horaEntradaReal.getTime();
  if (diff <= 0) return null;
  return Math.round(diff / 60_000);
}
