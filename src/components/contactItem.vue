<template>
    <div class="cm-block contact-item flex w-12 pl-4 py-2 shadow-1">
        <div class="contact-item__data flex-1 mr-4">
            <div class="data-block data-label">Имя</div>
            <div class="data-block data-label">Номер телефона</div>
            <div class="data-block data-label">E-mail</div>
            <div class="data-block">{{ props.contactData.contactName }}</div>
            <div class="data-block">{{ props.contactData.phoneNumber }}</div>
            <div class="data-block">{{ props.contactData.email }}</div>
        </div>
        <div class="contact-item__actions flex-3 h-full px-4 flex align-items-center justify-content-center">

            <!-- Изменить контакт -->
            <button-comp 
            title="Изменить контакт" 
            :icon="mdiSquareEditOutline"
            @click="emit('openEditionForm', props.contactData)"
            ></button-comp>

            <!-- Удалить контакт -->
            <button-comp 
            title="Удалить контакт" 
            :icon="mdiDeleteOutline" 
            style="color: var(--btn-red-fg);"
            @click="emit('openDeleteForm', props.contactData)"
            ></button-comp>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, type Ref, ref } from 'vue';
import { mdiSquareEditOutline } from '@mdi/js';
import { mdiDeleteOutline } from '@mdi/js';
import { type Contact } from '@/types';

// ####################################   PROPS   ##############
export interface Props {
    contactData: Contact,
};
const props = withDefaults(defineProps<Props>(), { });

const emit = defineEmits(['openEditionForm', 'openDeleteForm']);

</script>

<style scoped>
.contact-item {
    min-height: 80px;
    background-color: rgb(255, 255, 255);
    border-radius: 2px;
    cursor: pointer;
}

.contact-item  + .contact-item {
    margin-top: 0.4rem;
}
.contact-item__data {
    display: grid;
    grid-template-columns: minmax(10%, 33%) minmax(10%, 33%) minmax(10%, 33%);
    grid-template-rows: repeat(2, 1fr);
    gap: 0.25rem 0.15rem;
}
.data-block {
    background-color: rgba(79, 137, 192, 0.109);
    display: flex;
    overflow: auto;
    text-wrap: nowrap;
    justify-content: center;
    align-items: center;
    padding: 0 1rem;
    border-radius: 5px;
}
.data-label {
    display: flex;
    justify-content: center;
    font-size: .85rem;
    font-style: italic;
    color: rgba(76, 76, 76, 0.809);
}
.contact-item__actions {
    border-left: 2px solid var(--cm-border-light-color);
}
</style>