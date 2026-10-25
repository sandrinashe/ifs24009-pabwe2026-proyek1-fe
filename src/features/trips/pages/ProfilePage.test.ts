import { beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";
import * as tripApi from "../api/tripApi";
import { getAccessToken, putAccessToken } from "../../../helpers/apiHelper";
import { makeTrip, renderWithProviders } from "../../../test-utils";
import { useAuthStore } from "../../auth/states/authStore";
import ProfilePage from "./ProfilePage.vue";

vi.mock("../api/tripApi");
vi.mock("../../../helpers/toolsHelper", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../../helpers/toolsHelper")>()),
  showErrorDialog: vi.fn(),
}));

describe("ProfilePage", () => {
  beforeEach(() => {
    vi.mocked(tripApi.getTrips).mockResolvedValue([
      makeTrip({ id: 1, total_budget: 5000000, total_expenses: 1000000 }),
      makeTrip({ id: 2, total_budget: 2000000, total_expenses: undefined }),
    ]);
  });

  it("menampilkan data akun dan ringkasan perjalanan", async () => {
    const { wrapper, pinia } = await renderWithProviders(ProfilePage);
    useAuthStore(pinia).user = { id: 1, name: "budi", email: "budi@example.com" };
    await flushPromises();
    expect(wrapper.find('[data-testid="profile-name"]').text()).toBe("budi");
    expect(wrapper.find('[data-testid="profile-email"]').text()).toBe("budi@example.com");
    expect(wrapper.text()).toContain("B");
    expect(wrapper.find('[data-testid="stat-trips"]').text()).toBe("2");
    expect(wrapper.find('[data-testid="stat-budget"]').text()).toContain("7.000.000");
    expect(wrapper.find('[data-testid="stat-spent"]').text()).toContain("1.000.000");
  });

  it("tidak error saat data pengguna belum tersedia", async () => {
    const { wrapper } = await renderWithProviders(ProfilePage);
    await flushPromises();
    expect(wrapper.find('[data-testid="profile-name"]').text()).toBe("");
    expect(wrapper.text()).toContain("?");
  });

  it("tombol keluar menghapus sesi dan menuju halaman login", async () => {
    putAccessToken("tok");
    const { wrapper, router, pinia } = await renderWithProviders(ProfilePage);
    const auth = useAuthStore(pinia);
    auth.user = { id: 1, name: "Budi", email: "b@e.c" };
    await wrapper.find('[data-testid="profile-logout"]').trigger("click");
    await flushPromises();
    expect(getAccessToken()).toBeNull();
    expect(auth.user).toBeNull();
    expect(router.currentRoute.value.path).toBe("/auth/login");
  });
});
