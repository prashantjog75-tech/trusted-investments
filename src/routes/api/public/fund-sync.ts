import { timingSafeEqual } from "crypto";
import { createFileRoute } from "@tanstack/react-router";

function matchesSecret(received: string, expected: string) {
  const left = Buffer.from(received);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

export const Route = createFileRoute("/api/public/fund-sync")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected = process.env['LOVABLE_CRON_SECRET'];
        const received = request.headers.get("x-cron-secret") ?? "";
        if (!expected || !matchesSecret(received, expected)) return new Response("Unauthorized", { status: 401 });
        const { runAmfiSync } = await import("@/lib/fund-data/sync.server");
        const result = await runAmfiSync("scheduled");
        return Response.json(result, { status: result.ok ? 200 : 502 });
      },
    },
  },
});