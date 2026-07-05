// @vitest-environment node
import { describe, it, expect } from "vitest";
import {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
} from "@/lib/auth/jwt";

describe("auth: JWT access/refresh tokens", () => {
  it("signs and verifies a valid access token", async () => {
    const token = await signAccessToken({
      sub: "user-1",
      tenantId: "tenant-1",
      role: "OWNER",
      email: "owner@business.com",
    });
    const payload = await verifyAccessToken(token);
    expect(payload.sub).toBe("user-1");
    expect(payload.tenantId).toBe("tenant-1");
  });

  it("rejects a tampered access token", async () => {
    const token = await signAccessToken({
      sub: "user-1",
      tenantId: "tenant-1",
      role: "OWNER",
      email: "owner@business.com",
    });
    const tampered = token.slice(0, -2) + "xx";
    await expect(verifyAccessToken(tampered)).rejects.toThrow();
  });

  it("signs a refresh token carrying its rotation family", async () => {
    const { token, jti } = await signRefreshToken({ sub: "user-1", tenantId: "tenant-1", family: "fam-1" });
    const payload = await verifyRefreshToken(token);
    expect(payload.jti).toBe(jti);
    expect(payload.family).toBe("fam-1");
  });

  it("hashes tokens deterministically for DB storage/lookup", () => {
    expect(hashToken("abc")).toBe(hashToken("abc"));
    expect(hashToken("abc")).not.toBe(hashToken("abd"));
  });
});
