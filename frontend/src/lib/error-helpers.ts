/**
 * Error detection helpers for network and backend availability checks.
 */

export function isBackendOffline(error?: any): boolean {
  if (!error) return false;
  const msg = (error.message || "").toLowerCase();
  const code = error.code || "";
  const status = error.status || error.response?.status;

  return (
    code === "ERR_NETWORK" ||
    code === "ERR_CONNECTION_REFUSED" ||
    code === "ECONNREFUSED" ||
    msg.includes("network error") ||
    msg.includes("failed to fetch") ||
    msg.includes("connection refused") ||
    status === 502 ||
    status === 503 ||
    status === 504 ||
    status === 500
  );
}
