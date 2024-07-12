<template>
    <form class="relative cm-block w-max p-2" @submit.prevent>
        <span class="loading-overlay" v-show="isLoadingDeleteConfirm">
                <spinner-comp></spinner-comp>
            </span>
        <h1 class="text-3xl">
            Вы уверены, что хотите удалить контакт 
            <span class="font-bold">{{ props.data?.contactName }}</span>?
        </h1>
        <div class="delete-actions flex gap-4 flex justify-content-center py-2 mx-2 mt-2">

            <!-- ДА -->
            <button-comp 
            class="confirm-delete-btn"
            :icon="mdiDeleteOutline" 
            @click="confirmDelete"
            >Да</button-comp>
            
            <!-- НЕТ -->
            <button-comp 
            :icon="mdiClose"
            @click="emit('close')"
            >Нет</button-comp>
        </div>
    </form>
</template>

<script setup lang="ts">
import { mdiDeleteOutline, mdiClose } from '@mdi/js';
import { defineProps, defineEmits, ref } from 'vue';
import type { Contact } from '../types/index';
import { deleteContact } from '@/api/contactsApi';
import { useMainStore } from '@/stores/mainStore';


const mainStore = useMainStore();

// ####################################   PROPS   ##############
export interface Props {
    data: Contact | null;
}
const props = withDefaults(defineProps<Props>(), {
    data: null,
});

// ####################################   EMITS   ##############
const emit = defineEmits(['close', 'resetDeleteForm']);

// ####################################   DATA   ##############
const isLoadingDeleteConfirm = ref(false);

// ####################################   METHODS   ##############
async function confirmDelete() {
    try {
            isLoadingDeleteConfirm.value = true;
            const result: Array<Contact> = await deleteContact(props.data?.id!);
            if(result) {
                mainStore.contacts = result;
                mainStore.mutateVisibledNotice({ label: 'Контакт удален', lifecyle: 3000, type: 'success' });
                emit('resetDeleteForm');
                emit('close');
            } else {
                mainStore.mutateVisibledNotice({ label: 'Не удалось удалить контакт', lifecyle: 3000, type: 'error' });
                throw 'Не удалось удалить контакт'
            }
    } catch (err) {
        console.error('Ошибка при подтверждении формы удаления контакта', err);
    } finally {
        isLoadingDeleteConfirm.value = false;
    }
}
</script>

<style scoped>
.loading-overlay {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    position: absolute;
    right: 0; 
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(128, 128, 128, 0.18);
    backdrop-filter: blur(2px);
    z-index: 5;
    border-radius: var(--cm-radius);
}
.confirm-delete-btn {
    border-color: var(--btn-red-fg);
    color: var(--btn-red-fg);
}
.delete-actions {
    border-top: 1px solid var(--cm-border-light-color);
}
.confirm-delete-btn:active {
    background-color: #eb666653;
}
</style>