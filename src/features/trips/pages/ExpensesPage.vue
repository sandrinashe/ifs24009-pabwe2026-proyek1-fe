<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { useTripsStore } from "../states/tripsStore";
import {
  CATEGORY_COLORS,
  EXPENSE_CATEGORIES,
  formatCurrency,
  formatDate,
} from "../../../helpers/toolsHelper";

const store = useTripsStore();
const category = ref("");

onMounted(() => {
  store.asyncFetchAllExpenses();
});

const filtered = computed(() =>
  category.value
    ? store.allExpenses.filter((e) => e.category === category.value)
    : store.allExpenses
);
const total = computed(() =>
  filtered.value.reduce((sum, e) => sum + e.amount, 0)
);
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold">Semua Pengeluaran</h1>
        <p class="text-sm text-slate-600">
          Seluruh catatan pengeluaran dari semua perjalananmu.
        </p>
      </div>
      <div class="w-full sm:w-56">
        <label class="label-field" for="filter-category">Kategori</label>
        <select id="filter-category" v-model="category" class="input-field">
          <option value="">Semua kategori</option>
          <option v-for="c in EXPENSE_CATEGORIES" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
    </div>

    <p v-if="store.isLoading" class="text-sm text-slate-600">Memuat pengeluaran...</p>

    <p
      v-else-if="filtered.length === 0"
      class="card p-10 text-center text-sm text-slate-600"
      data-testid="empty-state"
    >
      Belum ada pengeluaran yang cocok.
    </p>

    <template v-else>
      <p class="text-sm font-semibold text-slate-700" data-testid="expenses-total">
        {{ filtered.length }} transaksi · Total {{ formatCurrency(total) }}
      </p>
      <div class="card overflow-x-auto">
        <table class="w-full text-left text-sm">
          <caption class="sr-only">Daftar pengeluaran dari seluruh perjalanan</caption>
          <thead class="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-600">
            <tr>
              <th scope="col" class="px-5 py-3">Tanggal</th>
              <th scope="col" class="px-5 py-3">Pengeluaran</th>
              <th scope="col" class="px-5 py-3">Perjalanan</th>
              <th scope="col" class="px-5 py-3">Kategori</th>
              <th scope="col" class="px-5 py-3 text-right">Jumlah</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="item in filtered" :key="item.id" data-testid="expense-row">
              <td class="whitespace-nowrap px-5 py-3">{{ formatDate(item.date) }}</td>
              <td class="px-5 py-3 font-semibold">{{ item.name }}</td>
              <td class="px-5 py-3">
                <RouterLink :to="`/trips/${item.trip_id}`" class="font-medium text-brand-700 underline-offset-2 hover:underline">
                  {{ item.trip_title }}
                </RouterLink>
              </td>
              <td class="px-5 py-3">
                <span class="inline-flex items-center gap-2">
                  <span class="inline-block h-2 w-2 rounded-full" :class="CATEGORY_COLORS[item.category]" aria-hidden="true" />
                  {{ item.category }}
                </span>
              </td>
              <td class="whitespace-nowrap px-5 py-3 text-right font-bold">{{ formatCurrency(item.amount) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>
