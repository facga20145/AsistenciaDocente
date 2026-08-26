import { DocenteEntity } from '../../../domain/entities/docente.entity';

export abstract class DocenteRepositoryPort {
  abstract crear(data: { nombres: string; apellidos: string; dni: string; correo?: string }): Promise<DocenteEntity>;
  abstract listar(): Promise<DocenteEntity[]>;
  abstract buscarPorId(id: number): Promise<DocenteEntity | null>;
  abstract actualizar(id: number, data: { nombres?: string; apellidos?: string; dni?: string; correo?: string; estadoActivo?: boolean }): Promise<DocenteEntity>;
  abstract eliminar(id: number): Promise<void>;
  abstract existeDni(dni: string, excludingId?: number): Promise<boolean>;
}
