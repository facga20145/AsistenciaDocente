import { useCallback, useState } from 'react';

export function useToast() {
  const [msg, setMsg] = useState<{ text: string; type: 'ok' | 'error' } | null>(null);

  const show = useCallback((text: string, type: 'ok' | 'error' = 'ok') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3500);
  }, []);

  return { msg, show };
}
