import {
  Clock,
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import { EstadoSesion, estadoToColor, estadoToLabel } from '../types';

const ESTADO_ICONS: Record<EstadoSesion, React.ReactNode> = {
  [EstadoSesion.PROGRAMADA]: <Clock size={12} />,
  [EstadoSesion.INICIADA]: <Activity size={12} className="animate-pulse" />,
  [EstadoSesion.FINALIZADA]: <CheckCircle2 size={12} />,
  [EstadoSesion.TARDANZA]: <AlertTriangle size={12} />,
  [EstadoSesion.AUSENTE]: <XCircle size={12} />,
};

export function EstadoBadge({ estado, large = false }: { estado: EstadoSesion; large?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${estadoToColor[estado]} ${
        large ? 'px-4 py-1.5 text-sm' : 'px-2.5 py-1 text-xs'
      }`}
    >
      {ESTADO_ICONS[estado]}
      {estadoToLabel[estado]}
    </span>
  );
}
