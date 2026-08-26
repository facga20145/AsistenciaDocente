export class CursoEntity {
  id: number;
  nombre: string;

  constructor(partial: Partial<CursoEntity>) {
    Object.assign(this, partial);
  }
}
