import { Injectable } from '@nestjs/common';
import { IFindAllAsistenciadocente } from '../../interfaces/find-all-asistenciadocente.interface';

@Injectable()
export class FindAllAsistenciadocenteService implements IFindAllAsistenciadocente {
  constructor() {}
}
