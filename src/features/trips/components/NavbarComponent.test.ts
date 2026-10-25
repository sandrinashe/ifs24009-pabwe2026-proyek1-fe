import { describe, expect, it } from "vitest";
import { flushPromises } from "@vue/test-utils";
import { getAccessToken, putAccessToken } from "../../../helpers/apiHelper";
import { renderWithProviders } from "../../../test-utils";
import { useAuthStore } from "../../auth/states/authStore";
import NavbarComponent from "./NavbarComponent.vue";

describe("NavbarComponent", () => {
  it("menampilkan nama pengguna yang sedang login", async () => {
    const { wrapper, pinia } = await renderWithProviders(NavbarComponent);
    useAuthStore(pinia).user = { id: 1, name: "Budi", email: "b@e.c" };
    await flushPromises();
    expect(wrapper.find('[data-testid="user-name"]').text()).toBe("Budi");
  });

  it("tidak error jika data pengguna belum tersedia", async () => {
    const { wrapper } = await renderWithProviders(NavbarComponent);
    expect(wrapper.find('[data-testid="user-name"]').text()).toBe("");
  });

  it("tombol keluar menghapus sesi dan menuju halaman login", async () => {
    putAccessToken("tok");
    const { wrapper, router, pinia } = await renderWithProviders(NavbarComponent);
    const auth = useAuthStore(pinia);
    auth.user = { id: 1, name: "Budi", email: "b@e.c" };
    await wrapper.find("button").trigger("click");
    await flushPromises();
    expect(getAccessToken()).toBeNull();
    expect(auth.user).toBeNull();
    expect(router.currentRoute.value.path).toBe("/auth/login");
  });

  it("menampilkan tautan navigasi ke perjalanan, pengeluaran, dan profil", async () => {
    const { wrapper } = await renderWithProviders(NavbarComponent);
    const links = wrapper.findAll('[data-testid="nav-link"]');
    expect(links.map((l) => l.attributes("href"))).toEqual(["/", "/expenses", "/profile"]);
    expect(wrapper.find("nav").attributes("aria-label")).toBe("Navigasi utama");
  });

  it("menandai tautan aktif sesuai halaman (beranda dan halaman lain)", async () => {
    const home = await renderWithProviders(NavbarComponent, { route: "/" });
    const homeLinks = home.wrapper.findAll('[data-testid="nav-link"]');
    expect(homeLinks[0].classes()).toContain("!bg-brand-50");
    expect(homeLinks[1].classes()).not.toContain("!bg-brand-50");

    const expenses = await renderWithProviders(NavbarComponent, { route: "/expenses" });
    const expenseLinks = expenses.wrapper.findAll('[data-testid="nav-link"]');
    expect(expenseLinks[0].classes()).not.toContain("!bg-brand-50");
    expect(expenseLinks[1].classes()).toContain("!bg-brand-50");
  });
});
