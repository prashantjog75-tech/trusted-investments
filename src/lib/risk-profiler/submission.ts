/**
 * Isolated submission adapter for a static site (GitHub Pages).
 * Uses Web3Forms (https://web3forms.com): its access key is designed to be public;
 * the destination inbox (prashant_jog@hotmail.com) is set in the Web3Forms dashboard,
 * so no password or private key ever ships in frontend code.
 * Configure at build time: VITE_RISK_PROFILE_FORM_ACCESS_KEY (and optionally VITE_RISK_PROFILE_FORM_ENDPOINT).
 */
import { SUBMISSION_RECIPIENT, SUBMISSION_SUBJECT } from "./config";

export type SubmissionOutcome = { ok: true } | { ok: false; reason: "not_configured" | "failed" };

export function getSubmissionConfig() {
  const env = import.meta.env as Record<string, string | undefined>;
  return {
    endpoint: env.VITE_RISK_PROFILE_FORM_ENDPOINT || "https://api.web3forms.com/submit",
    accessKey: env.VITE_RISK_PROFILE_FORM_ACCESS_KEY || "",
  };
}

export async function submitAssessment(payload: { name: string; phone: string; email: string; message: string; answers: unknown }): Promise<SubmissionOutcome> {
  const { endpoint, accessKey } = getSubmissionConfig();
  if (!accessKey) return { ok: false, reason: "not_configured" };
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: accessKey,
        subject: SUBMISSION_SUBJECT,
        from_name: "Prashant Jog Website",
        intended_recipient: SUBMISSION_RECIPIENT,
        name: payload.name || "Not provided",
        phone: payload.phone,
        ...(payload.email ? { email: payload.email, replyto: payload.email } : {}),
        message: payload.message,
        answers_json: JSON.stringify(payload.answers),
        botcheck: "",
      }),
    });
    if (!res.ok) return { ok: false, reason: "failed" };
    const data = (await res.json().catch(() => null)) as { success?: boolean } | null;
    return data?.success === true ? { ok: true } : { ok: false, reason: "failed" };
  } catch {
    return { ok: false, reason: "failed" };
  }
}
