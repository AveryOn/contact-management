<template>
    <div class="contact-form py-2 w-30rem">
        <div class="contact-form__header relative flex align-items-center justify-content-center">
            <svg-icon 
            class="title-icon" 
            type="mdi" 
            :path="mdiAccountBox"
            ></svg-icon>
            <h1 class="text-2xl ml-1">
                {{ (props.editMode === true)? 'Изменить контакт' : 'Добавить контакт' }}
            </h1>
            <svg-icon 
            class="title-icon close" 
            type="mdi" 
            :path="mdiClose"
            @click="emit('closeForm');"
            ></svg-icon>
        </div>

        <form @submit.prevent class="relative">
            <span class="loading-overlay" v-show="isLoadingConfirmData">
                <spinner-comp></spinner-comp>
            </span>
            <!-- Имя контакта -->
            <div class="input-block">
                <p class="ml-2 mb-0 text-lg">Имя контакта</p>
                <input-comp
                class="mx-2"
                :id="(props.editMode === true)? 'contact-edit-name-input' : 'contact-name-input'"
                :inner-icon-clickable="true"
                :error="errorsState.contactName.enable"
                :errorMsg="errorsState.contactName.msg"
                :placeholder="'Введите имя контакта'"
                @reset-error="handlerResetError('contactName')"
                @reset-value="handlerResetInput('contactName')"
                @update:model-value="(value: string) => recordTolocalStorage(value, 'contactName')"
                v-model.trim="formData.contactName"
                ></input-comp>
            </div>

            <!-- E-mail контакта -->
            <div class="input-block">
                <p class="ml-2 mb-0 text-lg">E-mail</p>
                <input-comp
                class="mx-2"
                :id="(props.editMode === true)? 'contact-eedit-mail-input' : 'contact-email-input'"
                :inner-icon-clickable="true"
                :error="errorsState.email.enable"
                :errorMsg="errorsState.email.msg"
                :placeholder="'Введите эл. почту контакта'"
                @reset-error="handlerResetError('email')"
                @reset-value="handlerResetInput('email')"
                @update:model-value="(value: string) => recordTolocalStorage(value, 'email')"
                v-model.trim="formData.email"
                ></input-comp>
            </div>

            <!-- Номер телефона контакта -->
            <div class="input-block">
                <p class="ml-2 mb-0 text-lg">Номер телефона</p>
                <input-comp
                class="mx-2"
                :id="(props.editMode === true)? 'contact-pedit-hone-input' : 'contact-phone-input'"
                :inner-icon-clickable="true"
                :error="errorsState.phoneNumber.enable"
                :errorMsg="errorsState.phoneNumber.msg"
                :placeholder="'Введите номер телефона контакта'"
                @reset-error="handlerResetError('phoneNumber')"
                @reset-value="handlerResetInput('phoneNumber')"
                @update:model-value="(value: string) => recordTolocalStorage(value, 'phoneNumber')"
                v-model.trim="formData.phoneNumber"
                :mask="'+7 (999) 999-99-99'"
                ></input-comp>
            </div>

            <div class="actions-block flex justify-content-end mx-2 mt-1">
                <button-comp 
                :icon="mdiCheck"
                @click="confirmForm"
                >Подтвердить</button-comp>
            </div>
            
        </form>
    </div>
</template>

<script setup lang="ts">
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiAccountBox, mdiCheck, mdiClose } from '@mdi/js';
import { defineProps, defineEmits } from 'vue';
import type { Contact } from '@/types';
import useContactForm from '@/composables/contactFormComposable';


// ####################################   PROPS   ##############
export interface Props {
    editMode?: boolean;
    editData?: Contact | null;
}


const props = withDefaults(defineProps<Props>(), {
    editMode: false,
    editData: null,
});

// ####################################   EMITS   ##############
const emit = defineEmits(['closeForm', 'resetEditForm']);

const {  
    isLoadingConfirmData,
    errorsState,
    formData,
    handlerResetError,
    handlerResetInput,
    recordTolocalStorage,
    confirmForm,
} = useContactForm(props, emit)

</script>

<style scoped>

.title-icon {
    color: var(--icon-color);
    width: calc(var(--icon-size) + 15px);
    height: calc(var(--icon-size) + 15px);
}
.title-icon.close {
    position: absolute;
    right: .4rem;
    width: 37px;
    height: 37px;
    transition: all .3s ease;
    border-radius: 50%;
    padding: 0.3rem;
    cursor: pointer;
}
.title-icon.close:hover {
    transition: all .3s ease;
    background-color: var(--btn-hover-bg);
}

.input-block {
    padding-bottom: 1.4rem;
}

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

    
</style>