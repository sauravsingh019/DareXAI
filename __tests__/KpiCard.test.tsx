import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import KpiCard from "@/components/KpiCard";

describe("KpiCard", () => {
  it("renders the label and value", () => {
    render(<KpiCard label="Active Opportunities" value="12" />);
    expect(screen.getByText("Active Opportunities")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("applies the amber accent class when specified", () => {
    render(<KpiCard label="Pending Follow-ups" value="3" accent="amber" />);
    expect(screen.getByText("3")).toHaveClass("text-amber");
  });
});
