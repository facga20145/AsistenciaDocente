export class DocenteEntity {
  id: number;
  nombres: string;
  apellidos: string;
  dni: string | null;
  correo: string;
  estadoActivo: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<DocenteEntity>) {
    Object.assign(this, partial);
  }
}
