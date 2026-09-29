import { createServerFn } from "@tanstack/react-start";

export const listFunds = createServerFn({ method: "GET" }).handler(async () => {
  const { listFundRecords } = await import("./repository.server");
  return listFundRecords();
});

export const getFundBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const { getFundRecord } = await import("./repository.server");
    return getFundRecord(data.slug);
  });

export const getDataStatus = createServerFn({ method: "GET" }).handler(async () => {
  const { getPublicDataStatus } = await import("./repository.server");
  return getPublicDataStatus();
});