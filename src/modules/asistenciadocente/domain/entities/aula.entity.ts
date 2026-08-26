export class AulaEntity {
  id: number;
  nombre: string;

  constructor(partial: Partial<AulaEntity>) {
    Object.assign(this, partial);
  }
}
