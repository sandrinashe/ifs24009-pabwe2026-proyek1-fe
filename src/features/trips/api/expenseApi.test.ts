import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiFetch } from "../../../helpers/apiHelper";
import { createExpense, deleteExpense, getAllExpenses, getExpenses } from "./expenseApi";

vi.mock("../../../helpers/apiHelper", () => ({ apiFetch: vi.fn() }));

const payload = {
  name: "Hotel",
  amount: 100000,
  date: "2026-12-01",
  category: "Akomodasi",
};

describe("expenseApi", () => {
  beforeEach(() => {
    vi.mocked(apiFetch).mockResolvedValue("hasil");
  });

  it("getAllExpenses -> GET /expenses", async () => {
    expect(await getAllExpenses()).toBe("hasil");
    expect(apiFetch).toHaveBeenCalledWith("/expenses");
  });

  it("getExpenses -> GET /expenses/trip/:tripId", async () => {
    expect(await getExpenses(3)).toBe("hasil");
    expect(apiFetch).toHaveBeenCalledWith("/expenses/trip/3");
  });

  it("createExpense -> POST /expenses dengan trip_id", async () => {
    await createExpense(3, payload);
    expect(apiFetch).toHaveBeenCalledWith("/expenses", {
      method: "POST",
      body: { trip_id: 3, ...payload },
    });
  });

  it("deleteExpense -> DELETE /expenses/:id", async () => {
    await deleteExpense(9);
    expect(apiFetch).toHaveBeenCalledWith("/expenses/9", { method: "DELETE" });
  });
});
