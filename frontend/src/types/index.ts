// =============================================================================
// ENUMS — reflejan los enums de prisma/schema.prisma
// =============================================================================

export const DiaSemana = {
  LUNES: 'LUNES',
  MARTES: 'MARTES',
  MIERCOLES: 'MIERCOLES',
  JUEVES: 'JUEVES',
  VIERNES: 'VIERNES',
  SABADO: 'SABADO',
  DOMINGO: 'DOMINGO',
} as const;
export type DiaSemana = (typeof DiaSemana)[keyof typeof DiaSemana];

export const EstadoSesion = {
  PROGRAMADA: 'PROGRAMADA',
  INICIADA: 'INICIADA',
  FINALIZADA: 'FINALIZADA',
  TARDANZA: 'TARDANZA',
  AUSENTE: 'AUSENTE',
} as const;
export type EstadoSesion = (typeof EstadoSesion)[keyof typeof EstadoSesion];

// =============================================================================
// DOCENTE — replica CrearDocenteDto, ActualizarDocenteDto y entidad Docente
// =============================================================================

/** Payload para POST /docentes — CrearDocenteDto */
export interface CrearDocenteDto {
  nombres: string;
  apellidos: string;
  dni: string;
  correo?: string;
}

/** Payload para PUT /docentes/:id — ActualizarDocenteDto */
export interface ActualizarDocenteDto {
  nombres?: string;
  apellidos?: string;
  dni?: string;
  correo?: string;
  estadoActivo?: boolean;
}

/** Respuesta completa de la entidad Docente */
export interface Docente {
  id: number;
  nombres: string;
  apellidos: string;
  dni: string;
  correo?: string | null;
  estadoActivo: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

/** Snapshot de docente embebido en SesionClaseResponse */
export interface DocenteSnapshot {
  id: number;
  nombres: string;
  apellidos: string;
}

// =============================================================================
// AULA — replica CrearAulaDto y entidad Aula
// =============================================================================

/** Payload para POST /aulas — CrearAulaDto */
export interface CrearAulaDto {
  nombre: string;
}

/** Respuesta completa de la entidad Aula */
export interface Aula {
  id: number;
  nombre: string;
}

/** Snapshot de aula embebido en SesionClaseResponse */
export interface AulaSnapshot {
  id: number;
  nombre: string;
}

// =============================================================================
// CURSO — entidad Curso (no tiene DTO propio en los controladores analizados)
// =============================================================================

/** Respuesta completa de la entidad Curso */
export interface Curso {
  id: number;
  nombre: string;
}

/** Snapshot de curso embebido en SesionClaseResponse */
export interface CursoSnapshot {
  id: number;
  nombre: string;
}

// =============================================================================
// HORARIO — replica CrearHorarioDto, ActualizarHorarioDto y entidad Horario
// =============================================================================

/** Payload para POST /horarios — CrearHorarioDto */
export interface CrearHorarioDto {
  docenteId: number;
  cursoId: number;
  aulaId: number;
  diaSemana: DiaSemana;
  /** ISO Time string, p.e. '1970-01-01T08:00:00.000Z' */
  horaInicio: string;
  /** ISO Time string, p.e. '1970-01-01T10:00:00.000Z' */
  horaFin: string;
}

/** Payload para PUT /horarios/:id — ActualizarHorarioDto */
export interface ActualizarHorarioDto {
  docenteId?: number;
  cursoId?: number;
  aulaId?: number;
  diaSemana?: DiaSemana;
  horaInicio?: string;
  horaFin?: string;
  activo?: boolean;
}

/** Respuesta completa de la entidad Horario */
export interface Horario {
  id: number;
  docenteId: number;
  cursoId: number;
  aulaId: number;
  diaSemana: DiaSemana;
  /** ISO Time string */
  horaInicio: string;
  /** ISO Time string */
  horaFin: string;
  activo: boolean;
  createdAt: string;
}

// =============================================================================
// SESIÓN — replica SesionClaseResponseDto (sesion-response.dto.ts)
// =============================================================================

/**
 * Respuesta principal del endpoint GET /sesiones/hoy y acciones
 * POST /sesiones/:id/iniciar | finalizar.
 * Replica exacta de SesionClaseResponseDto del backend.
 */
export interface SesionClaseResponse {
  id: number;
  horarioId: number;
  /** Fecha de la sesión, ISO 8601 date-only, e.g. '2026-08-26' */
  fecha: string;
  /** Hora programada de inicio, e.g. '08:00:00' */
  horaInicioProgramada: string;
  /** Hora programada de fin, e.g. '10:00:00' */
  horaFinProgramada: string;
  estado: EstadoSesion;
  /** null si el docente no ha iniciado */
  horaEntradaReal: string | null;
  /** null si la clase no ha finalizado */
  horaSalidaReal: string | null;
  docente: DocenteSnapshot;
  curso: CursoSnapshot;
  aula: AulaSnapshot;
}

// =============================================================================
// HELPERS DE PUNTUALIDAD — derivados de EstadoSesion para la UI
// =============================================================================

export type PuntualidadLabel =
  | 'A tiempo'
  | 'Tardanza'
  | 'Ausente'
  | 'En curso'
  | 'Finalizada'
  | 'Programada';

/** Mapea el estado de sesión a una etiqueta legible para la UI */
export const estadoToLabel: Record<EstadoSesion, PuntualidadLabel> = {
  [EstadoSesion.PROGRAMADA]: 'Programada',
  [EstadoSesion.INICIADA]: 'En curso',
  [EstadoSesion.FINALIZADA]: 'Finalizada',
  [EstadoSesion.TARDANZA]: 'Tardanza',
  [EstadoSesion.AUSENTE]: 'Ausente',
};

/** Colores Tailwind por estado para badges */
export const estadoToColor: Record<EstadoSesion, string> = {
  [EstadoSesion.PROGRAMADA]: 'bg-slate-700 text-slate-200 border-slate-600',
  [EstadoSesion.INICIADA]: 'bg-emerald-900/60 text-emerald-300 border-emerald-600',
  [EstadoSesion.FINALIZADA]: 'bg-blue-900/60 text-blue-300 border-blue-600',
  [EstadoSesion.TARDANZA]: 'bg-amber-900/60 text-amber-300 border-amber-600',
  [EstadoSesion.AUSENTE]: 'bg-red-900/60 text-red-300 border-red-600',
};
