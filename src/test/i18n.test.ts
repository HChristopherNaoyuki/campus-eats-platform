import { describe, expect, it } from "vitest";
import { DICTIONARIES } from "@/i18n";

describe("translations", () =>
{
  it("every English key has an Afrikaans translation", () =>
  {
    const missing = Object.keys(DICTIONARIES.en).filter((k) => !DICTIONARIES.af[k]);
    expect(missing).toEqual([]);
  });
});
