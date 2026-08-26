export class DocenteEntity {
  id: number;
  nombres: string;
  apellidos: string;
  dni: string;
  correo: string | null;
  estadoActivo: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<DocenteEntity>) {
    Object.assign(this, partial);
  }
}
