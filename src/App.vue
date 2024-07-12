<template>
    <div class="main-view h-full flex flex-column align-items-center justify-content-start">
        <!-- ФОРМА СОЗДАНИЯ КОНТАКТА -->
        <modal-comp 
        :visible="visibleCreationContactForm"
        @close="visibleCreationContactForm = false"
        >
            <contactForm @close-form="visibleCreationContactForm = false"/>
        </modal-comp>

        <!-- ФОРМА РЕДАКТИРОВАНИЯ КОНТАКТА-->
        <modal-comp 
        :visible="visibleEditionContactForm"
        @close="visibleEditionContactForm = false"
        >
            <contactForm 
            @close-form="visibleEditionContactForm = false"
            @reset-edit-form="handlerResetEditForm"
            :edit-mode="true"
            :edit-data="editionContentData"
            />
        </modal-comp>

        <!-- ФОРМА УДАЛЕНИЯ КОНТАКТА -->
        <modal-comp
        :visible="visibleDeleteContactForm"
        @reset-delete-form="handlerResetDeleteForm"
        >
        <!-- @close="handlerResetDeleteForm" -->
            <contactDeleteForm 
            :data="deleteDContentData"
            @close="visibleDeleteContactForm = false"
            />
        </modal-comp>

        <div class="contact-management-overlay w-9 mt-8 px-1 pb-2 flex flex-column align-items-center justify-content-start">
            <notice-comp></notice-comp>
            <toolBar 
            @open-creation-form="visibleCreationContactForm = true" 
            @update-search-value="(value: string) => searchContactsByName = value"
            :search-value="searchContactsByName"
            />
            <contactList 
            @open-creation-form="visibleCreationContactForm = true"
            @open-edition-form="(contact: Contact) => handlerOpenEditionForm(contact)"
            @open-delete-form="(contact: Contact) => handlerOpenDeleteForm(contact)"
            :contacts="searchByName"
            :is-loading-data="isLoadingContacts"
            :is-search-empty="isSearchEmpty"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Contact } from '@/types';
import toolBar from '@/components/toolBar.vue';
import contactList from '@/components/contactList.vue';
import contactDeleteForm from '@/components/contactDeleteForm.vue';
import contactForm from '@/components/contactForm.vue';
import useMainComposable from './composables/mainComposable';

const {
    searchContactsByName,
    isSearchEmpty,
    visibleCreationContactForm,
    visibleEditionContactForm,
    visibleDeleteContactForm,
    isLoadingContacts,
    editionContentData,
    deleteDContentData,
    searchByName,
    handlerOpenDeleteForm,
    handlerResetDeleteForm,
    handlerOpenEditionForm,
    handlerResetEditForm,
} = useMainComposable();

</script>

<style scoped>
.main-view {
    border: 1px solid black;
    min-height: 100vh;
}

.contact-management-overlay {}
</style>