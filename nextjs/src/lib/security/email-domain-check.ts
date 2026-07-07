import { promises as dns } from "node:dns";

/**
 * Verify an email's domain can actually receive mail (has MX, or A/AAAA fallback).
 * Node-only — never import from Edge middleware.
 *
 * Fails OPEN: on DNS timeout/error we return true so real users are never blocked
 * by a transient lookup problem. Only a definitive "no records" returns false.
 */
export async function emailDomainCanReceiveMail(email: string): Promise<boolean> {
  const domain = email.split("@")[1]?.trim().toLowerCase();
  if (!domain) return false;

  const lookup = async (): Promise<boolean> => {
    try {
      const mx = await dns.resolveMx(domain);
      if (mx.some((r) => r.exchange)) return true;
    } catch {
      // fall through to A/AAAA check
    }
    try {
      const a = await dns.resolve(domain);
      if (a.length > 0) return true;
    } catch {
      // no A record
    }
    try {
      const aaaa = await dns.resolve6(domain);
      return aaaa.length > 0;
    } catch {
      return false;
    }
  };

  const timeout = new Promise<boolean>((resolve) => {
    setTimeout(() => resolve(true), 2500);
  });

  return Promise.race([lookup(), timeout]);
}
