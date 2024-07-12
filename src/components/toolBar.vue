<template>
    <header 
    class="toolbar cm-block w-12 px-3 py-2 flex align-items-center justify-content-between shadow-4 rounded-lg"
    >
        <!-- TITLE BLOCK -->
        <div class="toolbar__title-block w-3">
            <h1 class="toolbar-title text-2xl px-1 py-0 w-max h-max font-light border-round-sm align-self-start">Contact Management</h1>
        </div>

        <!-- SEARCH BLOCK -->
        <div class="toolbar__search-block m-auto w-6 flex justify-content-center">
            <input-comp 
            class="w-6"
            :id="'search-input'" 
            v-model="searchValue"
            @update:model-value="(value: string) => emit('updateSearchValue', value)"
            :value="props.searchValue"
            :placeholder="'Поиск контакта'"
            :inner-icon-clickable="false"
            :icon="mdiMagnify"
            @inner-icon-action="console.log('action')"
            ></input-comp>
        </div>

        <!-- ACTIONS BLOCK -->
        <div class="toolbar__actions-panel w-3 flex align-items-center justify-content-end">
            <button-comp 
            title="Добавить контакт" 
            :icon="mdiAccountPlus"
            @click="emit('openCreationForm')"
            ></button-comp>
        </div>
    </header>
</template>

<script setup lang="ts">
import { ref, type Ref, defineEmits, computed } from 'vue';
import { mdiMagnify } from '@mdi/js';
import { mdiAccountPlus } from '@mdi/js';
import { useMainStore } from '@/stores/mainStore';

const store = useMainStore();

// ####################################   PROPS   ##############
export interface Props {
    searchValue: string;
}
const props = withDefaults(defineProps<Props>(), {
    searchValue: '',
});


const searchValue: Ref<string> = ref('');

const emit = defineEmits(['openCreationForm', 'updateSearchValue']);




</script>

<style scoped>
.toolbar {
}
.toolbar-title {
    color: var(--toolbar-title-fg);
    background-color: var(--toolbar-title-bg);
}
.toolbar__actions-panel {
}
.toolbar__search-block {
}
.toolbar__title-block {
}
</style>