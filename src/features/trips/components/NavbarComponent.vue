<script setup lang="ts">
import { RouterLink, useRouter } from "vue-router";
import { LogOut, Plane } from "lucide-vue-next";
import { useAuthStore } from "../../auth/states/authStore";

const links = [
  { to: "/", label: "Perjalanan" },
  { to: "/expenses", label: "Pengeluaran" },
  { to: "/profile", label: "Profil" },
];

const router = useRouter();
const auth = useAuthStore();

function onLogout() {
  auth.logout();
  router.replace("/auth/login");
}
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-slate-100 bg-white/80 backdrop-blur">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
      <RouterLink to="/" class="flex items-center gap-2 font-extrabold text-slate-900">
        <span
          class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-brand-600 text-white"
        >
          <Plane :size="18" />
        </span>
        TripBuddy
      </RouterLink>
      <nav aria-label="Navigasi utama" class="flex items-center gap-1 text-sm font-semibold">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100"
          :exact-active-class="link.to === '/' ? '!bg-brand-50 !text-brand-700' : ''"
          :active-class="link.to === '/' ? '' : '!bg-brand-50 !text-brand-700'"
          data-testid="nav-link"
        >
          {{ link.label }}
        </RouterLink>
      </nav>
      <div class="flex items-center gap-3">
        <span class="hidden text-sm font-medium text-slate-600 sm:inline" data-testid="user-name">
          {{ auth.user?.name }}
        </span>
        <button class="btn-ghost !px-3 !py-2" @click="onLogout">
          <LogOut :size="16" />
          Keluar
        </button>
      </div>
    </div>
  </header>
</template>
