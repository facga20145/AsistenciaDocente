import { Matches } from 'class-validator';
import { FECHA_REGEX } from '../../modules/asistenciadocente/application/utils/datetime.util';

export function IsFecha() {
  return Matches(FECHA_REGEX, {
    message: 'fecha debe tener formato dd/mm/yyyy (ej: 28/08/2026)',
  });
}
