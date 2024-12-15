<template>
    <v-autocomplete
        v-model="selectedValue"
        :items="itemList"
        :label="customProps.label"
        :disabled="customProps.disabled"
        :error-messages="customProps.errorMessages"
        :clearable="customProps.multiple"
        :multiple="customProps.multiple"
        :hint="customProps.hint"
        :chips="isCustomSelectionSlot ? false : customProps.multiple"
        hide-details="auto"
        rounded="lg"
        variant="outlined"
        @update:model-value="onModelValueUpdate"
    >
        <template
            v-if="isCustomSelectionSlot"
            #selection="{ item, index }"
        >
            <v-chip
                v-if="index === 0 && selectedAllItemChecked"
                size="small"
            >
                <span>{{ selectedAllItem.title }}</span>
            </v-chip>
            <v-chip
                v-else-if="index < 1 && !selectedAllItemChecked"
                size="small"
            >
                <span>{{ item.title }}</span>
            </v-chip>
            <span
                v-else-if="index === 1
                    && Array.isArray(selectedValue)
                    && !selectedAllItemChecked"
            >
                {{ `(+${selectedValue.length - 1})` }}
            </span>
        </template>

        <template
            v-if="customProps.multiple && itemList.length >= 2"
            #prepend-item
        >
            <v-list
                class="px-0 py-0 mx-0 my-0"
                density="compact"
                select-strategy="independent"
                :selected="prependListSelected"
                @update:selected="(selected: string[]) => { prependListSelected = selected; }"
                @click:select="onPrependListSelect"
            >
                <v-list-item
                    :title="selectedAllItem.title"
                    :value="selectedAllItem.value"
                    ripple
                >
                    <template #prepend="{ isActive }">
                        <v-checkbox-btn
                            :model-value="isActive"
                            :ripple="false"
                        />
                    </template>
                </v-list-item>
            </v-list>

            <v-divider />
        </template>
    </v-autocomplete>
</template>
<script lang="ts" setup>
import {
    computed,
    onMounted,
    ref,
    watch,
} from 'vue';

import { useI18n } from 'vue-i18n';

const { t } = useI18n();

type CustomValue = number | string | null;

interface CustomItem {
    title: string;
    value: CustomValue;
}
 
const emits = defineEmits<{(e: 'update:modelValue', value: CustomValue | CustomValue[] | null): void}>();

const customProps = withDefaults(defineProps<{
    modelValue: CustomValue | CustomValue[] | null;
    items: CustomItem[];
    label: string;
    multiple?: boolean;
    disabled?: boolean;
    disabledAllItem?: boolean;
    allItem?: CustomItem | null;
    errorMessages?: string | null;
    hint?: string;
}>(), {
    modelValue: null,
    items: () => [],
    label: '',
    multiple: false,
    disabled: false,
    disabledAllItem: true,
    allItem: null,
    errorMessages: null,
    hint: null,
});

const prependListSelected = ref<string[]>([]);
const selectedAllItem = computed(() => ({
    title: customProps.allItem ? customProps.allItem.title : t('common.all'),
    value: 'select-all',
}));

const selectedAllItemChecked = computed(() => prependListSelected.value.includes(selectedAllItem.value.value));

const itemList = computed((): CustomItem[] => {
    const originItemList = customProps.items.map((element) => ({ ...element }));

    if (customProps.multiple) {
        return originItemList;
    }

    if (!customProps.disabledAllItem && customProps.allItem) {
        return [{ ...customProps.allItem }, ...originItemList];
    }

    return [...originItemList];
});

const selectedValueRef = ref<CustomValue | CustomValue[] | null>(null);

const refreshPrependListSelected = () => {
    if (customProps.multiple) {
        if (Array.isArray(selectedValueRef.value) && itemList.value.length > 0) {
            const list = selectedValueRef.value;
            const isAllSelected = itemList.value.every((element) => list.includes(element.value));
            prependListSelected.value = isAllSelected ? [selectedAllItem.value.value] : [];
        } else {
            prependListSelected.value = [];
        }
    } else {
        prependListSelected.value = [];
    }
};

const selectedValue = computed({
    get: () => selectedValueRef.value,
    set: (value: CustomValue | CustomValue[] | null) => {
        selectedValueRef.value = value;
        refreshPrependListSelected();
    },
});

const isSelectedValueOutside = computed(() => {
    if (Array.isArray(selectedValue.value)) {
        return selectedValue.value.some((element) => !itemList.value.some((element2) => element2.value === element));
    }

    return !itemList.value.some((element) => element.value === selectedValue.value);
});

const isCustomSelectionSlot = computed(() => customProps.multiple && itemList.value.length >= 2 && !isSelectedValueOutside.value);

const emitModelValue = () => {
    emits('update:modelValue', selectedValue.value);
};

const selectAll = () => {
    selectedValue.value = itemList.value.map((element) => element.value);
    emitModelValue();
};

const onModelValueUpdate = () => {
    emitModelValue();
};

const onPrependListSelect = (item: {id: string, value: boolean}) => {
    if (item.id === selectedAllItem.value.value) {
        if (item.value) {
            selectAll();
        } else {
            selectedValue.value = [];
            emitModelValue();
        }
    }
};

const isSelectAllByDefault = () => (
    customProps.multiple
    && Array.isArray(customProps.modelValue)
    && itemList.value.length > 0
    && customProps.modelValue.length === 1
    && ((customProps.allItem && customProps.modelValue[0] === customProps.allItem.value)
        || (!customProps.allItem && customProps.modelValue[0] === null))
);

watch(
    () => customProps.modelValue,
    () => {
        if (isSelectAllByDefault()) {
            selectAll();
        } else {
            selectedValue.value = customProps.modelValue;
        }
    },
);

watch(
    () => customProps.items,
    () => {
        if (isSelectAllByDefault()) {
            selectAll();
        } else {
            refreshPrependListSelected();
        }
    },
);

watch(
    () => customProps.multiple,
    () => {
        if (Array.isArray(selectedValue.value)) {
            if (selectedValue.value.length > 0 && !customProps.multiple) {
                // 多選變單選
                if (!customProps.disabledAllItem
                    && customProps.allItem
                    && prependListSelected.value.includes(selectedAllItem.value.value)
                ) {
                    // 全選
                    selectedValue.value = customProps.allItem.value;
                } else {
                     
                    selectedValue.value = selectedValue.value[0];
                }
                emitModelValue();
            }
        } else if (customProps.multiple) {
            // 單選變多選
            if ((customProps.allItem && selectedValue.value === customProps.allItem.value)
                || (!customProps.allItem && selectedValue.value === null)) {
                // 全選
                selectAll();
            } else if (selectedValue.value !== null && selectedValue.value !== undefined) {
                selectedValue.value = [selectedValue.value];
                emitModelValue();
            }
        }
    },
);

onMounted(async () => {
    if (isSelectAllByDefault()) {
        selectAll();
    } else {
        selectedValue.value = customProps.modelValue;
    }
});
</script>
