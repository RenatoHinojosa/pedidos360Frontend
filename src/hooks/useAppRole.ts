import { useEffect, useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { acquireApiToken } from '../services/api/client';
import { decodeJwt } from '../utils/jwt';
import { resolveAppRole, type AppRole } from '../types/auth';

export function useAppRole(): { role: AppRole; loading: boolean } {
  const { instance, accounts } = useMsal();
  const account = accounts[0] ?? instance.getActiveAccount();
  const [role, setRole] = useState<AppRole>(() => {
    const claimsRoles = account?.idTokenClaims?.roles;
    return resolveAppRole(Array.isArray(claimsRoles) ? claimsRoles.map(String) : undefined);
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!account) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    const idTokenRoles = account.idTokenClaims?.roles;
    const fallbackRole = resolveAppRole(
      Array.isArray(idTokenRoles) ? idTokenRoles.map(String) : undefined,
    );
    setRole(fallbackRole);

    acquireApiToken(instance, account)
      .then((token) => {
        if (!cancelled) setRole(resolveAppRole(decodeJwt(token)?.roles));
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [account, instance]);

  return { role, loading };
}