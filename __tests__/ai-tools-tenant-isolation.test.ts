import { describe, it, expect, vi, beforeEach } from "vitest";

const {
  findFirstMock,
  findManyMock,
  updateMock,
  countMock,
  aggregateMock,
  createMock,
  auditCreateMock,
} = vi.hoisted(() => ({
  findFirstMock: vi.fn(),
  findManyMock: vi.fn(),
  updateMock: vi.fn(),
  countMock: vi.fn(),
  aggregateMock: vi.fn(),
  createMock: vi.fn(),
  auditCreateMock: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    contact: { findMany: findManyMock },
    opportunity: {
      findFirst: findFirstMock,
      update: updateMock,
      count: countMock,
      aggregate: aggregateMock,
    },
    task: { create: createMock, count: countMock },
    auditLog: { create: auditCreateMock },
  },
}));

vi.mock("@/lib/whatsapp", () => ({ sendWhatsAppMessage: vi.fn() }));

import { executeTool } from "@/lib/ai/tools";

describe("AI tool calling — tenant isolation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("search_contacts scopes the query to the caller's tenant", async () => {
    findManyMock.mockResolvedValue([{ id: "c1", name: "Rahul" }]);
    const result = await executeTool(
      "search_contacts",
      { query: "Rahul" },
      { tenantId: "tenant-A", userId: "u1" }
    );
    expect(findManyMock).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ tenantId: "tenant-A" }) })
    );
    expect(result).toEqual([{ id: "c1", name: "Rahul" }]);
  });

  it("update_opportunity refuses to touch an opportunity from another tenant", async () => {
    // Simulates: opportunity exists, but not under this tenant's filter.
    findFirstMock.mockResolvedValue(null);

    await expect(
      executeTool(
        "update_opportunity",
        { opportunityId: "opp-belongs-to-tenant-B", stage: "WON" },
        { tenantId: "tenant-A", userId: "u1" }
      )
    ).rejects.toThrow("Opportunity not found in this tenant");

    expect(findFirstMock).toHaveBeenCalledWith({
      where: { id: "opp-belongs-to-tenant-B", tenantId: "tenant-A" },
    });
    expect(updateMock).not.toHaveBeenCalled();
  });

  it("update_opportunity succeeds when the opportunity belongs to the caller's tenant", async () => {
    findFirstMock.mockResolvedValue({ id: "opp-1", tenantId: "tenant-A" });
    updateMock.mockResolvedValue({ id: "opp-1", stage: "WON" });

    const result = await executeTool(
      "update_opportunity",
      { opportunityId: "opp-1", stage: "WON" },
      { tenantId: "tenant-A", userId: "u1" }
    );

    expect(updateMock).toHaveBeenCalledWith({
      where: { id: "opp-1" },
      data: { stage: "WON", value: undefined },
    });
    expect(result).toEqual({ id: "opp-1", stage: "WON" });
  });

  it("every tool invocation is written to the audit log", async () => {
    findManyMock.mockResolvedValue([]);
    await executeTool("search_contacts", { query: "x" }, { tenantId: "tenant-A", userId: "u1" });
    expect(auditCreateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ tenantId: "tenant-A", action: "ai.tool.search_contacts" }),
      })
    );
  });
});
