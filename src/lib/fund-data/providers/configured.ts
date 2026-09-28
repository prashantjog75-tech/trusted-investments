import type { DataProvider, ProviderConfig, ProviderResult } from "../domain";
export class ConfiguredSourceProvider<T> implements DataProvider<T> {
  constructor(readonly config: ProviderConfig) {}
  async fetchAndNormalize(): Promise<ProviderResult<T>> {
    if (!this.config.enabled) return { ok: false, category: "disabled", message: `${this.config.name} is disabled`, sourceUrl: this.config.sourceUrl };
    if (!this.config.configured || !this.config.sourceUrl) return { ok: false, category: "not_configured", message: `${this.config.name} requires a verified official source configuration` };
    return { ok: false, category: "not_configured", message: `${this.config.name} has no source-specific parser configured`, sourceUrl: this.config.sourceUrl };
  }
}
