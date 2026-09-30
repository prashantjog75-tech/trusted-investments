declare module "bun:test" {
  type TestCallback = () => void | Promise<void>;
  type Matchers = {
    not: Matchers;
    toBe(expected: unknown): void;
    toEqual(expected: unknown): void;
    toHaveLength(expected: number): void;
    toContain(expected: unknown): void;
    toThrow(expected?: unknown): void;
    toBeCloseTo(expected: number, precision?: number): void;
    toBeGreaterThan(expected: number): void;
    toBeLessThan(expected: number): void;
    toBeNull(): void;
  };
  export function describe(name: string, callback: TestCallback): void;
  export function test(name: string, callback: TestCallback): void;
  export function expect(value: unknown): Matchers;
}