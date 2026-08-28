import { Matches } from 'class-validator';
import { HORA_REGEX } from '../../modules/asistenciadocente/application/utils/datetime.util';

export function IsHora() {
  return Matches(HORA_REGEX, {
    message: 'hora debe tener formato HH:mm (ej: 09:00)',
  });
}
