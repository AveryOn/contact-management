<template>
    <div class="input-overlay flex align-items-center">
        <input 
        class="input"
        type="text" 
        :id="`${props.id}`" 
        @input="(e) => updateValue(e)"
        :value="props.modelValue"
        :placeholder="`${props.placeholder}`"
        >
        <div class="input__icon-block flex align-items-center justify-content-center px-1">
            <svg-icon 
            class="input-icon relative" 
            :class="(props.innerIconClickable === true)? 'input-icon-clickable' : ''"
            @click="(props.innerIconClickable === true && props.icon)? emit('innerIconAction') : emit('resetValue')"
            type="mdi" 
            :path="props.icon ?? mdiBackspaceOutline"
            ></svg-icon>
        </div>

        <!-- Подпись ошибки -->
        <span 
        :id="`${props.id}-sign-error`"
        class="input-signature-error" 
        v-show="isShowError"
        >
            <svg-icon 
            class="error-icon mr-1" 
            type="mdi" 
            :path="mdiAlertCircleOutline"
            ></svg-icon>
            <p> {{ props.errorMsg }} </p>
            
        </span>
    </div>
</template>

<script setup lang="ts">
import Inputmask from 'inputmask';
import SvgIcon from '@jamescoyle/vue-icon';
import { defineProps, defineEmits, ref, onMounted, watch } from 'vue';
import { mdiBackspaceOutline } from '@mdi/js';
import { mdiAlertCircleOutline } from '@mdi/js';
import gsap from 'gsap';

// ####################################   PROPS   ##############
export interface Props {
    id?: number | string;
    modelValue?: string | number;
    placeholder?: string | number;
    icon?: string;
    innerIconClickable?: boolean;
    error?: boolean;
    errorMsg?: string;
    mask?: string;
}
const props = withDefaults(defineProps<Props>(), {
    id: '',
    innerIconClickable: false,
    error: false,
    errorMsg: '',
    mask: undefined,
});

// ####################################   EMITS  ##############
const emit = defineEmits(['update:modelValue', 'innerIconAction', 'resetValue', 'resetError']);


// ####################################   DATA  ##############
const isShowError = ref(false);

// ####################################   METHODS  ##############
// Обработка ввода в инпут
function updateValue(event: Event): void {
    const { value } = event.target as HTMLInputElement;
    emit('update:modelValue', value);
    if(isShowError.value === true) {
        toggleSignatureError(false)
            .then(() => {
                emit('resetError');
            })
    }
}


// Вкл/выкл подпись ошибки инпута
function toggleSignatureError(visible: boolean): Promise<boolean> {
    return new Promise((resolve, rej) => {
        try {
            if(visible === true) {
                isShowError.value = true;
                gsap.to(`#${props.id}-sign-error`, { duration: 0.3, opacity: 1, bottom: '-1.45rem' })
                    .then(() => {
                        resolve(true);
                    });
            } else {
                gsap.to(`#${props.id}-sign-error`, { duration: 0.3, opacity: 0, bottom: '0' })
                    .then(() => {
                        isShowError.value = false;
                        resolve(false);
                    });
            }
        } catch (err) {
            rej(err);
        }
    })
}


// ####################################   WATCH  ##############
watch(() => props.error, (newValue) => {
    toggleSignatureError(newValue);
})

// ####################################   LIFECYCLE HOOKS  ##############
onMounted(() => {
    if(props.mask) {
        const currentInput = document.getElementById(`${props.id}`);
        Inputmask({ mask: props.mask }).mask(currentInput);
    }
})

</script>

<style scoped>
.input-overlay {
    position: relative;
    border: 1px solid var(--input-border-color);
    border-radius: var(--input-radius);
    background-color: var(--input-bg);
}
.input-signature-error {
    position: absolute;
    display: flex;
    align-items: center;
    left: 0.4rem;
    color: var(--input-error);
    opacity: 0;
    bottom: 0;
    /* bottom: -1.45rem; */
    font-size: 14px;
    z-index: 0;
}
.input-icon {
    width: var(--input-icon-size);
    height: var(--input-icon-size);
    color: var(--input-icon-color);
    padding: 0.07rem;
    transition: all 0.4s ease;
}
.error-icon {
    width: calc(var(--input-icon-size) - 10px);
    height: calc(var(--input-icon-size) - 10px);
    color: var(--input-error);
    padding: 0.07rem;
}
.input-icon-clickable {
    cursor: pointer;
}
.input-icon-clickable:hover {
    background-color: var(--input-icon-hover-bg-color);
    border-radius: 5px;
    transition: all 0.3 ease;
}
.input-icon-clickable:active {
    background-color: var(--input-icon-active-bg-color);
    color: var(--input-icon-active-fg-color);
    border-radius: 5px;
    transition: all 0.1 ease;
}
.input {
    width: 100%;
    height: 80%;
    padding: .5rem .6rem .5rem .9rem;
    border: none;
    border-right: 2px solid rgba(128, 128, 128, 0.42);
    outline: rgba(0,0,0,0);
    color: var(--input-fg);
    border-radius: var(--input-radius);
    font-family: var(--cm-block-font);
    font-size: .95rem;
    z-index: 2;
}
.input::placeholder {
    color: var(--input-placeholder-fg);
}


</style>