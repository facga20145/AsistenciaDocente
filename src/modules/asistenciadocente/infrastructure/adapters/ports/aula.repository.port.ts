import { AulaEntity } from '../../../domain/entities/aula.entity';

export abstract class AulaRepositoryPort {
  abstract crear(data: { nombre: string }): Promise<AulaEntity>;
  abstract listar(): Promise<AulaEntity[]>;
  abstract buscarPorId(id: number): Promise<AulaEntity | null>;
  abstract actualizar(id: number, data: { nombre: string }): Promise<AulaEntity>;
  abstract eliminar(id: number): Promise<void>;
  abstract existeNombre(nombre: string, excludingId?: number): Promise<boolean>;
}
