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

export const DIA_SEMANA_LABELS: Record<DiaSemana, string> = {
  LUNES: 'Lunes',
  MARTES: 'Martes',
  MIERCOLES: 'Miércoles',
  JUEVES: 'Jueves',
  VIERNES: 'Viernes',
  SABADO: 'Sábado',
  DOMINGO: 'Domingo',
};

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

/** Payload para POST /cursos */
export interface CrearCursoDto {
  nombre: string;
}

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
  /** Formato HH:mm, ej: '09:00' */
  horaInicio: string;
  /** Formato HH:mm, ej: '11:00' */
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

/** Respuesta de GET/POST /horarios */
export interface Horario {
  id: number;
  diaSemana: DiaSemana;
  horaInicio: string;
  horaFin: string;
  activo: boolean;
  docente: DocenteSnapshot;
  curso: CursoSnapshot;
  aula: AulaSnapshot;
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
  /** Fecha de la sesión — formato dd/mm/yyyy */
  fecha: string;
  /** Hora programada de inicio — formato HH:mm */
  horaInicioProgramada: string;
  /** Hora programada de fin — formato HH:mm */
  horaFinProgramada: string;
  estado: EstadoSesion;
  /** null si no ha iniciado — formato dd/mm/yyyy HH:mm:ss */
  horaEntradaReal: string | null;
  /** null si no ha finalizado — formato dd/mm/yyyy HH:mm:ss */
  horaSalidaReal: string | null;
  /** Minutos entre entrada y salida reales (para reportes/export) */
  minutosTrabajados: number | null;
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
