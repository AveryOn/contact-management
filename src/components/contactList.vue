<template>
    <div
        class="contact-list cm-block w-full mt-3 px-3 py-4 flex justify-content-center shadow-4 rounded-lg">
        <div class="contact-list__wrapper relative w-11 h-full py-2 px-3 flex flex-column align-items-center overflow-auto overflow-x-hidden">
            <h1 class="empty-search" v-show="props.isSearchEmpty">По запросу ничего не найдено</h1>
            <div class="loading-overlay" v-show="props.isLoadingData === true">
                <spinner-comp></spinner-comp>
            </div>
            <div 
            class="stub-overlay"
            v-show="isShowStub && props.isLoadingData === false"
            >
                <h1 class="text-3xl">Контактов пока нет</h1>
                <button-comp 
                :icon="mdiAccountPlus" 
                @click="emit('openCreationForm')">
                    Добавить
                </button-comp>
            </div>
            <TransitionGroup name="list">
                <contactItem 
                v-for="contact in props.contacts"
                :key="contact.id"
                :contact-data="contact"
                @open-edition-form="(contact: Contact) => emit('openEditionForm', contact)"
                @open-delete-form="(contact: Contact) => emit('openDeleteForm', contact)"
                />
            </TransitionGroup>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useMainStore } from '@/stores/mainStore';
import contactItem from './contactItem.vue';
import { mdiAccountPlus } from '@mdi/js';
import { defineEmits, ref, watch } from 'vue';
import type { Contact } from '@/types';

const mainStore = useMainStore();

// ####################################   PROPS   ##############
export interface Props {
    isLoadingData?: boolean;
    contacts: Array<Contact> | [];
    isSearchEmpty: boolean;
}
const props = withDefaults(defineProps<Props>(), {
    isLoadingData: false,
    isSearchEmpty: false,
});

const emit = defineEmits(['openCreationForm', 'openEditionForm', 'openDeleteForm']);

const isShowStub = ref(true);


watch(() => mainStore.contacts.length, (newValue) => {
    if(newValue > 0) isShowStub.value = false;
    else if(newValue === 0) isShowStub.value = true;
});


</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.contact-list {
    height: 80vh;
}
.contact-list__wrapper {
    border-top: 2px solid var(--cm-border-light-color);
    border-bottom: 2px solid var(--cm-border-light-color);
    background-color: rgba(97, 189, 255, 0.134);
}
.loading-overlay {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 15;
    background-color: rgba(0,0,0,0);
    backdrop-filter: blur(3px);
}
.stub-overlay {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    right: 0;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
}
.empty-search {
    color: rgba(81, 81, 81, 0.561);
}

</style>