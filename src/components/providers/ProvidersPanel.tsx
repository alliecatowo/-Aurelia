import React, { useEffect, useState } from 'react';
import { providers } from '@/lib/providers';
import type { Detection, LoginStatus, Provider } from '@/lib/providers';

export const ProvidersPanel: React.FC = () => {
  const [detected, setDetected] = useState<Record<string, Detection>>({});
  const [logins, setLogins] = useState<Record<string, LoginStatus>>({});

  useEffect(() => {
    providers.forEach(async (p) => {
      const result = await p.detect();
      setDetected((prev) => ({ ...prev, [p.id]: result }));
      if (result.available) {
        try {
          const who = await p.exec('whoami');
          setLogins((prev) => ({
            ...prev,
            [p.id]: { loggedIn: who.code === 0, message: who.stdout.trim() },
          }));
        } catch {
          setLogins((prev) => ({ ...prev, [p.id]: { loggedIn: false } }));
        }
      }
    });
  }, []);

  async function handleLogin(p: Provider) {
    const status = await p.ensureLogin();
    setLogins((prev) => ({ ...prev, [p.id]: status }));
  }

  return (
    <div className="space-y-4">
      {providers.map((p) => {
        const d = detected[p.id];
        const l = logins[p.id];
        return (
          <div key={p.id} className="border rounded p-2 space-y-1">
            <div className="font-semibold capitalize">{p.id}</div>
            <div className="text-sm text-muted-foreground">
              {d ? (d.available ? `v${d.version}` : 'Not found') : 'Detecting...'}
            </div>
            {d?.available && (
              <div className="text-sm">
                {l
                  ? l.loggedIn
                    ? `Signed in${l.message ? ` (${l.message})` : ''}`
                    : 'Not signed in'
                  : 'Checking login...'}
              </div>
            )}
            {d?.available && !l?.loggedIn && (
              <button
                className="text-xs underline"
                onClick={() => handleLogin(p)}
              >
                Sign in
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProvidersPanel;
