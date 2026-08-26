import { CursoEntity } from '../../../domain/entities/curso.entity';

export abstract class CursoRepositoryPort {
  abstract crear(data: { nombre: string }): Promise<CursoEntity>;
  abstract listar(): Promise<CursoEntity[]>;
  abstract buscarPorId(id: number): Promise<CursoEntity | null>;
  abstract actualizar(id: number, data: { nombre: string }): Promise<CursoEntity>;
  abstract eliminar(id: number): Promise<void>;
}
