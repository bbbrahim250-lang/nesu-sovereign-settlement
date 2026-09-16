const BASE = process.env.EXPO_PUBLIC_BACKEND_URL;

export type Totals = {
  total: number;
  by_region: Record<string, number>;
};

export type PledgeInput = {
  name: string;
  institution: string;
  country: string;
  email: string;
  message?: string;
  tier: number;
  region: string;
};

export type Certificate = {
  id: string;
  name: string;
  institution: string;
  region: string;
  tier: number;
  date: string;
};

export async function fetchTotals(): Promise<Totals> {
  const res = await fetch(`${BASE}/api/pledges/totals`);
  if (!res.ok) throw new Error(`totals ${res.status}`);
  return res.json();
}

export async function submitPledge(input: PledgeInput): Promise<Certificate> {
  const res = await fetch(`${BASE}/api/pledges`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`pledge ${res.status}`);
  return res.json();
}
