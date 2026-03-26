import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { FlutterwaveProvider } from "./flutterwave.provider";

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

describe("FlutterwaveProvider", () => {
  let provider: FlutterwaveProvider;

  beforeEach(() => {
    provider = new FlutterwaveProvider({
      secretKey: "test-secret-key",
      baseUrl: "https://api.flutterwave.com",
    });
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("can be instantiated with config", () => {
    expect(provider).toBeInstanceOf(FlutterwaveProvider);
  });
});
