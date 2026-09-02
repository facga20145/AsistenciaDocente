import { PrismaClient, DiaSemana, EstadoSesion } from '@prisma/client';

const prisma = new PrismaClient();

function timeUTC(h: number, m = 0, s = 0): Date {
  return new Date(Date.UTC(1970, 0, 1, h, m, s));
}

function dateUTC(y: number, mo: number, d: number): Date {
  return new Date(Date.UTC(y, mo - 1, d));
}

async function main() {
  console.log('Limpiando datos existentes...');
  await prisma.sesionClase.deleteMany();
  await prisma.horario.deleteMany();
  await prisma.docente.deleteMany();
  await prisma.curso.deleteMany();
  await prisma.aula.deleteMany();

  // ─── AULAS ────────────────────────────────────────────────────
  console.log('Creando aulas (20)...');
  const aulasData = [
    'Aula 101', 'Aula 102', 'Aula 103', 'Aula 104', 'Aula 105',
    'Aula 201', 'Aula 202', 'Aula 203', 'Aula 204', 'Aula 205',
    'Aula 301', 'Aula 302', 'Aula 303', 'Aula 304', 'Aula 305',
    'Aula 401', 'Aula 402', 'Aula 403', 'Aula 404', 'Aula 405',
  ];
  const aulas = [];
  for (const nombre of aulasData) {
    aulas.push(await prisma.aula.create({ data: { nombre } }));
  }

  // ─── CURSOS ───────────────────────────────────────────────────
  console.log('Creando cursos (10)...');
  const cursosData = [
    'Matemáticas', 'Comunicación', 'Ciencias', 'Inglés', 'Historia',
    'Física', 'Química', 'Geografía', 'Educación Física', 'Arte',
  ];
  const cursos = [];
  for (const nombre of cursosData) {
    cursos.push(await prisma.curso.create({ data: { nombre } }));
  }

  // ─── DOCENTES (20) ────────────────────────────────────────────
  console.log('Creando docentes (20)...');
  const docentesData = [
    { nombres: 'Juan Carlos', apellidos: 'Pérez López', correo: 'juan.perez@institucion.edu.pe' },
    { nombres: 'María Elena', apellidos: 'García Ruiz', correo: 'maria.garcia@institucion.edu.pe' },
    { nombres: 'Roberto', apellidos: 'Díaz Martínez', correo: 'roberto.diaz@institucion.edu.pe' },
    { nombres: 'Ana Lucía', apellidos: 'Torres Vega', correo: 'ana.torres@institucion.edu.pe' },
    { nombres: 'Carlos Alberto', apellidos: 'Ramírez Soto', correo: 'carlos.ramirez@institucion.edu.pe' },
    { nombres: 'Luis Fernando', apellidos: 'Morales Cruz', correo: 'luis.morales@institucion.edu.pe' },
    { nombres: 'Sandra Patricia', apellidos: 'Vargas Luna', correo: 'sandra.vargas@institucion.edu.pe' },
    { nombres: 'Miguel Ángel', apellidos: 'Rojas Peña', correo: 'miguel.rojas@institucion.edu.pe' },
    { nombres: 'Claudia', apellidos: 'Fernández Solís', correo: 'claudia.fernandez@institucion.edu.pe' },
    { nombres: 'Francisco', apellidos: 'Castillo Ríos', correo: 'francisco.castillo@institucion.edu.pe' },
    { nombres: 'Gloria Estela', apellidos: 'Mendoza Paredes', correo: 'gloria.mendoza@institucion.edu.pe' },
    { nombres: 'Ricardo', apellidos: 'Salazar Cometa', correo: 'ricardo.salazar@institucion.edu.pe' },
    { nombres: 'Patricia', apellidos: 'Lozano Herrera', correo: 'patricia.lozano@institucion.edu.pe' },
    { nombres: 'Fernando', apellidos: 'Guerrero Díaz', correo: 'fernando.guerrero@institucion.edu.pe' },
    { nombres: 'Diana', apellidos: 'Córdova Ramos', correo: 'diana.cordova@institucion.edu.pe' },
    { nombres: 'Eduardo', apellidos: 'Núñez Campos', correo: 'eduardo.nunez@institucion.edu.pe' },
    { nombres: 'Verónica', apellidos: 'Silva Aguirre', correo: 'veronica.silva@institucion.edu.pe' },
    { nombres: 'Ángel', apellidos: 'Medina Flores', correo: 'angel.medina@institucion.edu.pe' },
    { nombres: 'Carmen', apellidos: 'Reyes Torres', correo: 'carmen.reyes@institucion.edu.pe' },
    { nombres: 'Pedro', apellidos: 'Aquino Valdez', correo: 'pedro.aquino@institucion.edu.pe' },
  ];
  const docentes = [];
  for (const d of docentesData) {
    docentes.push(await prisma.docente.create({ data: d }));
  }

  // ─── HORARIOS HOY LUNES 31 AGOSTO (5) ────────────────────────
  console.log('Creando horarios HOY (LUNES 31 agosto)...');
  const hLunes = [];
  const lunesSlots = [
    { d: 0, c: 0, a: 0, hi: 7, hf: 9 },
    { d: 1, c: 1, a: 1, hi: 9, hf: 11 },
    { d: 2, c: 2, a: 2, hi: 11, hf: 13 },
    { d: 3, c: 3, a: 3, hi: 14, hf: 16 },
    { d: 4, c: 4, a: 4, hi: 16, hf: 18 },
  ];
  for (const s of lunesSlots) {
    hLunes.push(await prisma.horario.create({
      data: { docenteId: docentes[s.d].id, cursoId: cursos[s.c].id, aulaId: aulas[s.a].id, diaSemana: DiaSemana.LUNES, horaInicio: timeUTC(s.hi), horaFin: timeUTC(s.hf) },
    }));
  }

  // ─── HORARIOS MAÑANA MARTES 1 SEPTIEMBRE (3) ─────────────────
  console.log('Creando horarios MAÑANA (MARTES 1 septiembre)...');
  const hMartes = [];
  const martesSlots = [
    { d: 0, c: 2, a: 2, hi: 8, hf: 10 },
    { d: 1, c: 0, a: 0, hi: 10, hf: 12 },
    { d: 2, c: 3, a: 3, hi: 14, hf: 16 },
  ];
  for (const s of martesSlots) {
    hMartes.push(await prisma.horario.create({
      data: { docenteId: docentes[s.d].id, cursoId: cursos[s.c].id, aulaId: aulas[s.a].id, diaSemana: DiaSemana.MARTES, horaInicio: timeUTC(s.hi), horaFin: timeUTC(s.hf) },
    }));
  }

  // ─── HORARIOS MIÉRCOLES 2 SEPTIEMBRE (20 — para probar scroll) ─
  console.log('Creando horarios MIÉRCOLES 2 septiembre (20 para scroll)...');
  // 2 clases paralelas por franja, 10 franjas = 20 horarios
  const hMiercoles = [];
  const miercolesSlots = [
    { d: 0, c: 0, a: 0, hi: 7, hf: 8 },
    { d: 1, c: 1, a: 1, hi: 7, hf: 8 },
    { d: 2, c: 2, a: 2, hi: 8, hf: 9 },
    { d: 3, c: 3, a: 3, hi: 8, hf: 9 },
    { d: 4, c: 4, a: 4, hi: 9, hf: 10 },
    { d: 5, c: 5, a: 5, hi: 9, hf: 10 },
    { d: 6, c: 6, a: 6, hi: 10, hf: 11 },
    { d: 7, c: 7, a: 7, hi: 10, hf: 11 },
    { d: 8, c: 8, a: 8, hi: 11, hf: 12 },
    { d: 9, c: 9, a: 9, hi: 11, hf: 12 },
    { d: 10, c: 0, a: 10, hi: 14, hf: 15 },
    { d: 11, c: 1, a: 11, hi: 14, hf: 15 },
    { d: 12, c: 2, a: 12, hi: 15, hf: 16 },
    { d: 13, c: 3, a: 13, hi: 15, hf: 16 },
    { d: 14, c: 4, a: 14, hi: 16, hf: 17 },
    { d: 15, c: 5, a: 15, hi: 16, hf: 17 },
    { d: 16, c: 6, a: 16, hi: 17, hf: 18 },
    { d: 17, c: 7, a: 17, hi: 17, hf: 18 },
    { d: 18, c: 8, a: 18, hi: 18, hf: 19 },
    { d: 19, c: 9, a: 19, hi: 18, hf: 19 },
  ];
  for (const s of miercolesSlots) {
    hMiercoles.push(await prisma.horario.create({
      data: { docenteId: docentes[s.d].id, cursoId: cursos[s.c].id, aulaId: aulas[s.a].id, diaSemana: DiaSemana.MIERCOLES, horaInicio: timeUTC(s.hi), horaFin: timeUTC(s.hf) },
    }));
  }

  // ─── GENERAR SESIONES ─────────────────────────────────────────
  console.log('Generando sesiones lunes 31 agosto...');
  const lunes = dateUTC(2026, 8, 31);
  for (const h of hLunes) {
    await prisma.sesionClase.create({
      data: { horarioId: h.id, fecha: lunes, horaInicioProgramada: h.horaInicio, horaFinProgramada: h.horaFin, estado: EstadoSesion.PROGRAMADA },
    });
  }

  console.log('Generando sesiones martes 1 septiembre...');
  const martes = dateUTC(2026, 9, 1);
  for (const h of hMartes) {
    await prisma.sesionClase.create({
      data: { horarioId: h.id, fecha: martes, horaInicioProgramada: h.horaInicio, horaFinProgramada: h.horaFin, estado: EstadoSesion.PROGRAMADA },
    });
  }

  console.log('Generando sesiones miércoles 2 septiembre (20)...');
  const miercoles = dateUTC(2026, 9, 2);
  for (const h of hMiercoles) {
    await prisma.sesionClase.create({
      data: { horarioId: h.id, fecha: miercoles, horaInicioProgramada: h.horaInicio, horaFinProgramada: h.horaFin, estado: EstadoSesion.PROGRAMADA },
    });
  }

  console.log('--- RESUMEN ---');
  console.log(`Aulas: ${aulas.length}`);
  console.log(`Cursos: ${cursos.length}`);
  console.log(`Docentes: ${docentes.length}`);
  console.log(`Sesiones LUNES (31 ago): ${hLunes.length}`);
  console.log(`Sesiones MARTES (1 sep): ${hMartes.length}`);
  console.log(`Sesiones MIÉRCOLES (2 sep): ${hMiercoles.length} ← scroll automático`);
  console.log('Seed completado!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { prisma.$disconnect(); });
