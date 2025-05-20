<script setup lang="ts">
import { useApiMutation, useApiQuery } from "@/utils/api";
import { syncRefs } from "@vueuse/core";
import { ref } from "vue";
import type * as T from "../../../bindings";
import type { NullToUndefined } from "@/utils/types/utils";
import { useI18n } from "vue-i18n";

const serverSettings = useApiQuery(
    "/api/settings",
    { method: "GET" },
    { initialData: () => ({ enabled: true, cookie_categories: [] }) },
);
const settings = ref<NullToUndefined<T.Settings>>({
    enabled: true,
    cookie_categories: [],
});
syncRefs(serverSettings.data, settings);
const saveMutation = useApiMutation("/api/settings", { method: "POST" }, { invalidate: [serverSettings] });

const { locale } = useI18n();
</script>
<template>
    <div class="flex flex-col p-4 gap-4 w-full">
        <UCheckbox v-model="settings.enabled" :label="$t('input.label.enabled')" />
        <UButton
            color="neutral"
            variant="subtle"
            icon="i-tabler-plus"
            @click="
                if (!settings.cookie_categories) {
                    settings.cookie_categories = [];
                }
                settings.cookie_categories.push({
                    id: undefined,
                    enabled: false,
                    label: {},
                    description: {},
                    placeholder_html: undefined,
                    selectors: [],
                });
            "
        >
            {{ $t("action.create.cookie_category") }}
        </UButton>
        <UCard v-for="cookie_category in settings.cookie_categories">
            <div class="flex flex-row items-center gap-4">
                <h2 class="font-bold text-lg">{{ $t("cookie_category") }}: {{ cookie_category.label[locale] }}</h2>
                <UCheckbox v-model="cookie_category.enabled" :label="$t('input.label.enabled')" />
            </div>
            <UFormField :label="$t('input.label.label')">
                <LocalizedTextInput v-model="cookie_category.label" />
            </UFormField>
            <UFormField :label="$t('input.label.description')">
                <LocalizedTextInput v-model="cookie_category.description" />
            </UFormField>
        </UCard>
        <UButton @click="saveMutation.mutate(settings)" icon="i-tabler-device-floppy">{{ $t("action.save") }}</UButton>
    </div>
</template>
