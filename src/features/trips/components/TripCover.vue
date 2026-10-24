<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { defaultCover } from "../../../helpers/toolsHelper";

const props = defineProps<{
  src?: string | null;
  tripId: number;
  alt: string;
}>();

// Bila URL gambar gagal dimuat, tampilkan ilustrasi bawaan.
const failed = ref(false);
watch(
  () => props.src,
  () => {
    failed.value = false;
  }
);

const resolved = computed(() =>
  props.src && !failed.value ? props.src : defaultCover(props.tripId)
);
</script>

<template>
  <img
    :src="resolved"
    :alt="alt"
    class="h-full w-full object-cover"
    loading="lazy"
    @error="failed = true"
  />
</template>
