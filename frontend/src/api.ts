const BASE = process.env.EXPO_PUBLIC_BACKEND_URL;

export type Totals = {
  total: number;
  by_region: Record<string, number>;
};

export type MembershipInput = {
  name: string;
  institution: string;
  country: string;
  email: string;
  message?: string;
  tier: string;
  region: string;
};

export type Certificate = {
  id: string;
  name: string;
  institution: string;
  region: string;
  tier: string;
  amount_usd: number;
  status: string;
  date: string;
};

export async function fetchTotals(): Promise<Totals> {
  const res = await fetch(`${BASE}/api/memberships/totals`);
  if (!res.ok) throw new Error(`totals ${res.status}`);
  return res.json();
}

export async function submitMembership(input: MembershipInput): Promise<Certificate> {
  const res = await fetch(`${BASE}/api/memberships`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`membership ${res.status}`);
  return res.json();
}

export type RequestStatus = {
  id: string;
  institution: string;
  tier: string;
  region: string;
  status: "pending_review" | "in_review" | "approved" | "declined";
  date: string;
  updated_at: string | null;
};

export async function fetchRequestStatus(id: string): Promise<RequestStatus | null> {
  const res = await fetch(`${BASE}/api/memberships/${encodeURIComponent(id.trim())}/status`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`status ${res.status}`);
  return res.json();
}

// ---- Team console (admin key) ----------------------------------------------

export type MembershipRecord = {
  id: string;
  name: string;
  institution: string;
  country: string;
  email: string;
  message: string | null;
  tier: string;
  amount_usd: number;
  region: string;
  status: RequestStatus["status"];
  created_at: string;
  updated_at: string | null;
};

export class UnauthorizedError extends Error {}

function adminHeaders(key: string) {
  return { "X-Admin-Key": key, "Content-Type": "application/json" };
}

export async function verifyAdminKey(key: string): Promise<boolean> {
  const res = await fetch(`${BASE}/api/admin/verify`, { method: "POST", headers: adminHeaders(key) });
  if (res.status === 401) return false;
  if (!res.ok) throw new Error(`verify ${res.status}`);
  return true;
}

export async function listMemberships(key: string, status?: string): Promise<MembershipRecord[]> {
  const q = status ? `?status=${encodeURIComponent(status)}` : "";
  const res = await fetch(`${BASE}/api/admin/memberships${q}`, { headers: adminHeaders(key) });
  if (res.status === 401) throw new UnauthorizedError();
  if (!res.ok) throw new Error(`list ${res.status}`);
  return res.json();
}

export async function updateMembershipStatus(
  key: string,
  id: string,
  status: RequestStatus["status"],
): Promise<RequestStatus> {
  const res = await fetch(`${BASE}/api/memberships/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    headers: adminHeaders(key),
    body: JSON.stringify({ status }),
  });
  if (res.status === 401) throw new UnauthorizedError();
  if (!res.ok) throw new Error(`update ${res.status}`);
  return res.json();
}
