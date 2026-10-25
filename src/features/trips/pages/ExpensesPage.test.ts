import { beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";
import * as expenseApi from "../api/expenseApi";
import { deferred, makeExpense, renderWithProviders } from "../../../test-utils";
import ExpensesPage from "./ExpensesPage.vue";

vi.mock("../api/expenseApi");
vi.mock("../../../helpers/toolsHelper", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../../helpers/toolsHelper")>()),
  showErrorDialog: vi.fn(),
}));

const rows: expenseApi.ExpenseWithTrip[] = [
  { ...makeExpense({ id: 1, name: "Hotel", amount: 1000000, category: "Akomodasi" }), trip_title: "Liburan Bali" },
  { ...makeExpense({ id: 2, name: "Sate", amount: 50000, category: "Makanan", trip_id: 2 }), trip_title: "Trip Lombok" },
];

describe("ExpensesPage", () => {
  beforeEach(() => {
    vi.mocked(expenseApi.getAllExpenses).mockResolvedValue(rows);
  });

  it("menampilkan status memuat lalu tabel pengeluaran dengan total", async () => {
    const pending = deferred<expenseApi.ExpenseWithTrip[]>();
    vi.mocked(expenseApi.getAllExpenses).mockReturnValue(pending.promise);
    const { wrapper } = await renderWithProviders(ExpensesPage);
    expect(wrapper.text()).toContain("Memuat pengeluaran...");
    pending.resolve(rows);
    await flushPromises();
    expect(wrapper.findAll('[data-testid="expense-row"]')).toHaveLength(2);
    expect(wrapper.find('[data-testid="expenses-total"]').text()).toContain("2 transaksi");
    expect(wrapper.find("caption").text()).toContain("Daftar pengeluaran");
    expect(wrapper.findAll("th").every((th) => th.attributes("scope") === "col")).toBe(true);
  });

  it("menautkan setiap pengeluaran ke halaman perjalanannya", async () => {
    const { wrapper } = await renderWithProviders(ExpensesPage);
    await flushPromises();
    const link = wrapper.findAll('[data-testid="expense-row"]')[1].find("a");
    expect(link.attributes("href")).toBe("/trips/2");
    expect(link.text()).toBe("Trip Lombok");
  });

  it("memfilter berdasarkan kategori dan menghitung ulang total", async () => {
    const { wrapper } = await renderWithProviders(ExpensesPage);
    await flushPromises();
    await wrapper.find("#filter-category").setValue("Makanan");
    expect(wrapper.findAll('[data-testid="expense-row"]')).toHaveLength(1);
    expect(wrapper.find('[data-testid="expenses-total"]').text()).toContain("1 transaksi");
    await wrapper.find("#filter-category").setValue("");
    expect(wrapper.findAll('[data-testid="expense-row"]')).toHaveLength(2);
  });

  it("menampilkan keadaan kosong jika tidak ada data atau filter tidak cocok", async () => {
    const { wrapper } = await renderWithProviders(ExpensesPage);
    await flushPromises();
    await wrapper.find("#filter-category").setValue("Transportasi");
    expect(wrapper.find('[data-testid="empty-state"]').exists()).toBe(true);

    vi.mocked(expenseApi.getAllExpenses).mockResolvedValue([]);
    const empty = await renderWithProviders(ExpensesPage);
    await flushPromises();
    expect(empty.wrapper.find('[data-testid="empty-state"]').exists()).toBe(true);
  });
});
