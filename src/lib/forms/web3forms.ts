/**
 * Shared static-site form adapter (Web3Forms). Reuses the same public access key as the
 * risk assessment: VITE_RISK_PROFILE_FORM_ACCESS_KEY. Destination inbox is set in the
 * Web3Forms dashboard (prashant_jog@hotmail.com). No secrets in frontend code.
 */
import { getSubmissionConfig } from "@/lib/risk-profiler/submission";

export type FormOutcome = { ok: true } | { ok: false; reason: "not_configured" | "failed" };

export function makeReference(prefix: "GRV" | "FBK" | "MTG", now = new Date()) {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `PJ-${prefix}-${now.getFullYear()}-${n}`;
}

export async function sendForm(subject: string, fields: Record<string, string>, replyTo?: string): Promise<FormOutcome> {
  const { endpoint, accessKey } = getSubmissionConfig();
  if (!accessKey) return { ok: false, reason: "not_configured" };
  const message = Object.entries(fields).map(([k, v]) => `${k}: ${v || "Not provided"}`).join("\n");
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: accessKey, subject, from_name: "Prashant Jog Website",
        ...fields, ...(replyTo ? { replyto: replyTo } : {}), message, botcheck: "",
      }),
    });
    if (!res.ok) return { ok: false, reason: "failed" };
    const data = (await res.json().catch(() => null)) as { success?: boolean } | null;
    return data?.success === true ? { ok: true } : { ok: false, reason: "failed" };
  } catch {
    return { ok: false, reason: "failed" };
  }
}
