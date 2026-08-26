import { AsistenciadocenteEntity } from '../entities/asistenciadocente.entity';

export class AsistenciadocenteFactory {
  static createFromPrisma(data: any): AsistenciadocenteEntity {
    return new AsistenciadocenteEntity();
  }
}
