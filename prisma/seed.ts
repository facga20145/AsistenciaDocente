import { PrismaClient, DiaSemana, EstadoSesion } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Limpiando datos existentes...');
  await prisma.sesionClase.deleteMany();
  await prisma.horario.deleteMany();
  await prisma.docente.deleteMany();
  await prisma.curso.deleteMany();
  await prisma.aula.deleteMany();

  console.log('Creando aulas...');
  const a1 = await prisma.aula.create({ data: { nombre: 'Aula 101' } });
  const a2 = await prisma.aula.create({ data: { nombre: 'Aula 102' } });
  const a3 = await prisma.aula.create({ data: { nombre: 'Aula 103' } });
  const a4 = await prisma.aula.create({ data: { nombre: 'Aula 201' } });
  const a5 = await prisma.aula.create({ data: { nombre: 'Aula 202' } });
  const aulas = [a1, a2, a3, a4, a5];

  console.log('Creando cursos...');
  const c1 = await prisma.curso.create({ data: { nombre: 'Matemáticas' } });
  const c2 = await prisma.curso.create({ data: { nombre: 'Comunicación' } });
  const c3 = await prisma.curso.create({ data: { nombre: 'Ciencias' } });
  const c4 = await prisma.curso.create({ data: { nombre: 'Inglés' } });
  const c5 = await prisma.curso.create({ data: { nombre: 'Historia' } });
  const cursos = [c1, c2, c3, c4, c5];

  console.log('Creando docentes...');
  const d1 = await prisma.docente.create({ data: { nombres: 'Juan Carlos', apellidos: 'Pérez López', dni: '12345678', correo: 'juan.perez@institucion.edu.pe' } });
  const d2 = await prisma.docente.create({ data: { nombres: 'María Elena', apellidos: 'García Ruiz', dni: '23456789', correo: 'maria.garcia@institucion.edu.pe' } });
  const d3 = await prisma.docente.create({ data: { nombres: 'Roberto', apellidos: 'Díaz Martínez', dni: '34567890', correo: 'roberto.diaz@institucion.edu.pe' } });
  const d4 = await prisma.docente.create({ data: { nombres: 'Ana Lucía', apellidos: 'Torres Vega', dni: '45678901', correo: 'ana.torres@institucion.edu.pe' } });
  const d5 = await prisma.docente.create({ data: { nombres: 'Carlos Alberto', apellidos: 'Ramírez Soto', dni: '56789012', correo: 'carlos.ramirez@institucion.edu.pe' } });
  const docentes = [d1, d2, d3, d4, d5];

  console.log('Creando horarios para HOY (MIÉRCOLES 26)...');
  const h1 = await prisma.horario.create({ data: { docenteId: d1.id, cursoId: c1.id, aulaId: a1.id, diaSemana: DiaSemana.MIERCOLES, horaInicio: new Date('1970-01-01T08:00:00'), horaFin: new Date('1970-01-01T10:00:00') } });
  const h2 = await prisma.horario.create({ data: { docenteId: d2.id, cursoId: c2.id, aulaId: a2.id, diaSemana: DiaSemana.MIERCOLES, horaInicio: new Date('1970-01-01T08:00:00'), horaFin: new Date('1970-01-01T10:00:00') } });
  const h3 = await prisma.horario.create({ data: { docenteId: d3.id, cursoId: c3.id, aulaId: a3.id, diaSemana: DiaSemana.MIERCOLES, horaInicio: new Date('1970-01-01T10:00:00'), horaFin: new Date('1970-01-01T12:00:00') } });
  const h4 = await prisma.horario.create({ data: { docenteId: d4.id, cursoId: c4.id, aulaId: a4.id, diaSemana: DiaSemana.MIERCOLES, horaInicio: new Date('1970-01-01T14:00:00'), horaFin: new Date('1970-01-01T16:00:00') } });
  const h5 = await prisma.horario.create({ data: { docenteId: d5.id, cursoId: c5.id, aulaId: a5.id, diaSemana: DiaSemana.MIERCOLES, horaInicio: new Date('1970-01-01T16:00:00'), horaFin: new Date('1970-01-01T18:00:00') } });

  console.log('Creando horarios para MAÑANA (JUEVES 27)...');
  const h6 = await prisma.horario.create({ data: { docenteId: d1.id, cursoId: c3.id, aulaId: a3.id, diaSemana: DiaSemana.JUEVES, horaInicio: new Date('1970-01-01T08:00:00'), horaFin: new Date('1970-01-01T10:00:00') } });
  const h7 = await prisma.horario.create({ data: { docenteId: d2.id, cursoId: c1.id, aulaId: a1.id, diaSemana: DiaSemana.JUEVES, horaInicio: new Date('1970-01-01T10:00:00'), horaFin: new Date('1970-01-01T12:00:00') } });
  const h8 = await prisma.horario.create({ data: { docenteId: d3.id, cursoId: c4.id, aulaId: a4.id, diaSemana: DiaSemana.JUEVES, horaInicio: new Date('1970-01-01T14:00:00'), horaFin: new Date('1970-01-01T16:00:00') } });

  console.log('Generando sesiones para HOY (26 agosto 2026)...');
  const hoy = new Date('2026-08-26');
  for (const h of [h1, h2, h3, h4, h5]) {
    await prisma.sesionClase.create({
      data: { horarioId: h.id, fecha: hoy, horaInicioProgramada: h.horaInicio, horaFinProgramada: h.horaFin, estado: EstadoSesion.PROGRAMADA },
    });
  }

  console.log('Generando sesiones para MAÑANA (27 agosto 2026)...');
  const manana = new Date('2026-08-27');
  for (const h of [h6, h7, h8]) {
    await prisma.sesionClase.create({
      data: { horarioId: h.id, fecha: manana, horaInicioProgramada: h.horaInicio, horaFinProgramada: h.horaFin, estado: EstadoSesion.PROGRAMADA },
    });
  }

  console.log('--- RESUMEN ---');
  console.log(`Aulas: ${aulas.length}`);
  console.log(`Cursos: ${cursos.length}`);
  console.log(`Docentes: ${docentes.length}`);
  console.log(`Horarios Miércoles: 5`);
  console.log(`Horarios Jueves: 3`);
  console.log(`Sesiones hoy (26): 5`);
  console.log(`Sesiones mañana (27): 3`);
  console.log('Seed completado!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
