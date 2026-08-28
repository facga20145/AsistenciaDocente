import { useCallback, useEffect, useRef, useState } from 'react';
import { sesionApi } from '../api';
import type { SesionClaseResponse } from '../types';

const POLL_INTERVAL_MS = 12_000;

export function useSesionesHoy() {
  const [sesiones, setSesiones] = useState<SesionClaseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cargarSesiones = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const data = await sesionApi.listarHoy();
      setSesiones(data);
    } catch (e) {
      setError((e as Error).message ?? 'Error al cargar sesiones');
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarSesiones();
    pollingRef.current = setInterval(() => cargarSesiones(true), POLL_INTERVAL_MS);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [cargarSesiones]);

  return { sesiones, loading, error, cargarSesiones, pollIntervalMs: POLL_INTERVAL_MS };
}
