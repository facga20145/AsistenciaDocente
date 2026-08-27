/**
 * Cliente HTTP para la API de Asistencia Docente
 * Base URL: http://localhost:3000 (ajustar según .env del backend)
 *
 * Mapea exactamente los endpoints expuestos en:
 *   - sesion.controller.ts   → /sesiones
 *   - docente.controller.ts  → /docentes
 *   - horario.controller.ts  → /horarios
 *   - aula.controller.ts     → /aulas
 */

import type {
  SesionClaseResponse,
  Docente,
  CrearDocenteDto,
  Aula,
  CrearAulaDto,
  Horario,
  CrearHorarioDto,
  ActualizarHorarioDto,
} from '../types';

// ---------------------------------------------------------------------------
// Configuración de base URL — se puede sobreescribir con variable de entorno
// ---------------------------------------------------------------------------
const BASE_URL =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) ||
  'http://localhost:3000';

// ---------------------------------------------------------------------------
// Helper fetch con manejo de errores centralizado
// ---------------------------------------------------------------------------
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...init?.headers,
    },
    ...init,
  });

  if (!response.ok) {
    let message = `HTTP ${response.status} ${response.statusText}`;
    try {
      const body = await response.json();
      message = body?.message ?? message;
    } catch {
      // no-op
    }
    throw new Error(message);
  }

  // 204 No Content o body vacío
  const text = await response.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

// =============================================================================
// SESIONES  — sesion.controller.ts  →  @Controller('sesiones')
// =============================================================================

export const sesionApi = {
  /**
   * POST /sesiones/generar-del-dia
   * Crea las instancias de sesiones_clase para el día actual (idempotente).
   */
  generarDelDia: (): Promise<SesionClaseResponse[]> =>
    request<SesionClaseResponse[]>('/sesiones/generar-del-dia', { method: 'POST' }),

  /**
   * GET /sesiones/hoy
   * Devuelve todas las sesiones del día actual con docente, curso y aula.
   * Usar con polling cada 10-15 s para la vista pública.
   */
  listarHoy: (): Promise<SesionClaseResponse[]> =>
    request<SesionClaseResponse[]>('/sesiones/hoy'),

  /**
   * POST /sesiones/:id/iniciar
   * Marca la sesión como INICIADA y registra horaEntradaReal = NOW().
   * Solo permite iniciar desde estado PROGRAMADA o TARDANZA.
   */
  iniciar: (id: number): Promise<SesionClaseResponse> =>
    request<SesionClaseResponse>(`/sesiones/${id}/iniciar`, { method: 'POST' }),

  /**
   * POST /sesiones/:id/finalizar
   * Marca la sesión como FINALIZADA y registra horaSalidaReal = NOW().
   * Solo permite finalizar desde estado INICIADA.
   */
  finalizar: (id: number): Promise<SesionClaseResponse> =>
    request<SesionClaseResponse>(`/sesiones/${id}/finalizar`, { method: 'POST' }),

  /**
   * POST /sesiones/marcar-ausentes-tardanzas
   * Revisa sesiones PROGRAMADAS cuya hora ya pasó y las marca TARDANZA o AUSENTE.
   */
  marcarAusentesTardanzas: (): Promise<void> =>
    request<void>('/sesiones/marcar-ausentes-tardanzas', { method: 'POST' }),
};

// =============================================================================
// DOCENTES  — docente.controller.ts  →  @Controller('docentes')
// =============================================================================

export const docenteApi = {
  /**
   * POST /docentes
   * Registra un nuevo docente. El DNI debe ser único.
   */
  crear: (dto: CrearDocenteDto): Promise<Docente> =>
    request<Docente>('/docentes', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),

  /**
   * GET /docentes
   * Devuelve la lista de todos los docentes.
   */
  listar: (): Promise<Docente[]> => request<Docente[]>('/docentes'),
};

// =============================================================================
// HORARIOS  — horario.controller.ts  →  @Controller('horarios')
// =============================================================================

export const horarioApi = {
  /**
   * POST /horarios
   * Valida cruces de horario para el mismo docente y aula antes de crear.
   */
  crear: (dto: CrearHorarioDto): Promise<Horario> =>
    request<Horario>('/horarios', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),

  /**
   * GET /horarios
   * Lista todos los horarios registrados.
   */
  listar: (): Promise<Horario[]> => request<Horario[]>('/horarios'),

  /**
   * PUT /horarios/:id
   * Actualiza un horario y revalida cruces de horario.
   */
  actualizar: (id: number, dto: ActualizarHorarioDto): Promise<Horario> =>
    request<Horario>(`/horarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dto),
    }),

  /**
   * DELETE /horarios/:id
   * Elimina un horario por su ID.
   */
  eliminar: (id: number): Promise<void> =>
    request<void>(`/horarios/${id}`, { method: 'DELETE' }),
};

// =============================================================================
// AULAS  — aula.controller.ts  →  @Controller('aulas')
// =============================================================================

export const aulaApi = {
  /**
   * POST /aulas
   * Crea una nueva aula. El nombre debe ser único.
   */
  crear: (dto: CrearAulaDto): Promise<Aula> =>
    request<Aula>('/aulas', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),

  /**
   * GET /aulas
   * Lista todas las aulas disponibles.
   */
  listar: (): Promise<Aula[]> => request<Aula[]>('/aulas'),
};
