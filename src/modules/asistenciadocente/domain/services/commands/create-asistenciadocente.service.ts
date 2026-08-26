import { Injectable } from '@nestjs/common';
import { ICreateAsistenciadocente } from '../../interfaces/create-asistenciadocente.interface';

@Injectable()
export class CreateAsistenciadocenteService implements ICreateAsistenciadocente {
  constructor() {}
}
