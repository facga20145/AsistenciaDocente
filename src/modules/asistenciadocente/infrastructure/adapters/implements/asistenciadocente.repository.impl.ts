import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AsistenciadocenteRepositoryPort } from '../ports/asistenciadocente.repository.port';

@Injectable()
export class AsistenciadocenteRepositoryPortImpl implements AsistenciadocenteRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}
}
