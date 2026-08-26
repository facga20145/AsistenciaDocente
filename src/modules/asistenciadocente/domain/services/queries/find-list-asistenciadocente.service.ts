import { Injectable } from '@nestjs/common';
import { IFindListAsistenciadocente } from '../../interfaces/find-list-asistenciadocente.interface';

@Injectable()
export class FindListAsistenciadocenteService implements IFindListAsistenciadocente {
  constructor() {}
}
