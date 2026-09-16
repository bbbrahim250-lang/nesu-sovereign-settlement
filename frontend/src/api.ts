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
