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
        <UCard v-for="cookie_category in settings.cookie_categories" :ui="{ body: 'space-y-2' }">
            <div class="flex flex-row items-center gap-4">
                <h2 class="font-bold text-lg">{{ $t("cookie_category") }}: {{ cookie_category.label[locale] }}</h2>
                <UCheckbox v-model="cookie_category.enabled" :label="$t('input.label.enabled')" />
                <DeleteModal
                    :name="$t('cookie_category')"
                    :id="`cookie_category_${cookie_category.id}`"
                    @confirm="settings.cookie_categories?.splice(settings.cookie_categories.indexOf(cookie_category), 1)"
                >
                    <UButton color="error" icon="i-tabler-trash" variant="ghost" />
                </DeleteModal>
            </div>
            <UFormField :label="$t('input.label.label')">
                <LocalizedTextInput v-model="cookie_category.label" />
            </UFormField>
            <UFormField :label="$t('input.label.description')">
                <LocalizedTextInput v-model="cookie_category.description" />
            </UFormField>
            <UFormField :label="$t('input.label.placeholder_html')" :hint="$t('input.hint.placeholder_html')" required>
                <UTextarea v-model="cookie_category.placeholder_html" class="w-full" :rows="12" required />
            </UFormField>
            <div class="flex flex-row gap-4 items-center">
                <h3 class="font-medium">{{ $t("selectors") }}</h3>
                <p class="text-(--ui-text-muted) text-sm">{{ $t("hint.selectors") }}</p>
                <UButton
                    color="neutral"
                    variant="ghost"
                    icon="i-tabler-plus"
                    @click="
                        if (!cookie_category.selectors) {
                            cookie_category.selectors = [];
                        }
                        cookie_category.selectors.push({ id: undefined, selector: '' });
                    "
                >
                    {{ $t("action.create.selector") }}
                </UButton>
            </div>
            <UCard v-for="selector in cookie_category.selectors" :ui="{ body: 'p-3 sm:p-3 flex flex-row gap-4 items-start' }">
                <UFormField :label="$t('input.label.selector')">
                    <UInput v-model="selector.selector" />
                </UFormField>
                <DeleteModal
                    :name="$t('selector')"
                    id="selector"
                    @confirm="cookie_category.selectors?.splice(cookie_category.selectors.indexOf(selector), 1)"
                >
                    <UButton color="error" icon="i-tabler-trash" variant="ghost" />
                </DeleteModal>
            </UCard>
        </UCard>
        <UButton @click="saveMutation.mutate(settings)" icon="i-tabler-device-floppy">{{ $t("action.save") }}</UButton>
    </div>
</template>
