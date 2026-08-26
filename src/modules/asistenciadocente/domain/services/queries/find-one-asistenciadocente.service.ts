import { Injectable } from '@nestjs/common';
import { IFindOneAsistenciadocente } from '../../interfaces/find-one-asistenciadocente.interface';

@Injectable()
export class FindOneAsistenciadocenteService implements IFindOneAsistenciadocente {
  constructor() {}
}
