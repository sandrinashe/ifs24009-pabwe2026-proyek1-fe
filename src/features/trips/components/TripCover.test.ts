import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import TripCover from "./TripCover.vue";

const render = (props: Record<string, unknown>) =>
  mount(TripCover, { props: { tripId: 1, alt: "Sampul", ...props } });

describe("TripCover", () => {
  it("menampilkan URL gambar yang diberikan", () => {
    const wrapper = render({ src: "https://img.example.com/a.jpg" });
    expect(wrapper.find("img").attributes("src")).toBe("https://img.example.com/a.jpg");
    expect(wrapper.find("img").attributes("alt")).toBe("Sampul");
  });

  it("memakai ilustrasi bawaan bila src kosong atau null", () => {
    expect(render({ src: null }).find("img").attributes("src")).toBe("/covers/cover-2.svg");
    expect(render({}).find("img").attributes("src")).toBe("/covers/cover-2.svg");
  });

  it("beralih ke ilustrasi bawaan bila gambar gagal dimuat", async () => {
    const wrapper = render({ src: "https://img.example.com/rusak.jpg" });
    await wrapper.find("img").trigger("error");
    expect(wrapper.find("img").attributes("src")).toBe("/covers/cover-2.svg");
  });

  it("mencoba lagi saat src berubah setelah gagal", async () => {
    const wrapper = render({ src: "https://img.example.com/rusak.jpg" });
    await wrapper.find("img").trigger("error");
    await wrapper.setProps({ src: "https://img.example.com/baru.jpg" });
    expect(wrapper.find("img").attributes("src")).toBe("https://img.example.com/baru.jpg");
  });
});
