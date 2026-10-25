<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { LogOut } from "lucide-vue-next";
import { useAuthStore } from "../../auth/states/authStore";
import { useTripsStore } from "../states/tripsStore";
import { formatCurrency } from "../../../helpers/toolsHelper";

const router = useRouter();
const auth = useAuthStore();
const store = useTripsStore();

onMounted(() => {
  store.asyncFetchTrips();
});

const initial = computed(() => (auth.user?.name ?? "?").charAt(0).toUpperCase());
const totalBudget = computed(() =>
  store.trips.reduce((sum, t) => sum + t.total_budget, 0)
);
const totalSpent = computed(() =>
  store.trips.reduce((sum, t) => sum + (t.total_expenses ?? 0), 0)
);

function onLogout() {
  auth.logout();
  router.replace("/auth/login");
}
</script>

<template>
  <div class="mx-auto max-w-2xl space-y-6">
    <h1 class="text-2xl font-extrabold">Profil Saya</h1>

    <section class="card flex items-center gap-4 p-6" aria-label="Data akun">
      <div
        class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-600 text-2xl font-extrabold text-white"
        aria-hidden="true"
      >
        {{ initial }}
      </div>
      <div class="min-w-0">
        <p class="truncate text-lg font-extrabold" data-testid="profile-name">{{ auth.user?.name }}</p>
        <p class="truncate text-sm text-slate-600" data-testid="profile-email">{{ auth.user?.email }}</p>
      </div>
    </section>

    <section aria-labelledby="stats-heading" class="space-y-3">
      <h2 id="stats-heading" class="text-lg font-extrabold">Ringkasan Perjalanan</h2>
      <dl class="grid gap-4 sm:grid-cols-3">
        <div class="card p-4">
          <dt class="text-xs font-bold uppercase tracking-wide text-slate-600">Jumlah perjalanan</dt>
          <dd class="mt-1 text-xl font-extrabold" data-testid="stat-trips">{{ store.trips.length }}</dd>
        </div>
        <div class="card p-4">
          <dt class="text-xs font-bold uppercase tracking-wide text-slate-600">Total anggaran</dt>
          <dd class="mt-1 text-xl font-extrabold" data-testid="stat-budget">{{ formatCurrency(totalBudget) }}</dd>
        </div>
        <div class="card p-4">
          <dt class="text-xs font-bold uppercase tracking-wide text-slate-600">Total pengeluaran</dt>
          <dd class="mt-1 text-xl font-extrabold" data-testid="stat-spent">{{ formatCurrency(totalSpent) }}</dd>
        </div>
      </dl>
    </section>

    <button class="btn-ghost" data-testid="profile-logout" @click="onLogout">
      <LogOut :size="16" /> Keluar dari akun
    </button>
  </div>
</template>
