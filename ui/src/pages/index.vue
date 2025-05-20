<script setup lang="ts">
import { useApiMutation, useApiQuery } from "@/utils/api";
import { syncRefs } from "@vueuse/core";
import { ref } from "vue";

const serverSettings = useApiQuery(
    "/api/settings",
    { method: "GET" },
    { initialData: () => ({ enabled: true, cookie_categories: [] }) },
);
const settings = ref({
    enabled: true,
    cookie_categories: [],
});
syncRefs(serverSettings.data, settings);
const saveMutation = useApiMutation("/api/settings", { method: "POST" }, { invalidate: [serverSettings] });
</script>
<template>
    <div class="flex flex-col p-4 gap-4 w-full">
        <UCheckbox v-model="settings.enabled" :label="$t('input.label.enabled')" />
        <UButton @click="saveMutation.mutate(settings)" icon="i-tabler-device-floppy">Save</UButton>
    </div>
</template>
