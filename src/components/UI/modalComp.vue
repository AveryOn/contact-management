<template>
    <div 
    class="modal-overlay" 
    ref="modalOverlay"
    v-show="isVisibleModal"
    @click="emit('close')"
    >
        <div 
        class="cm-block modal-content shadow-3" 
        ref="modalContent"
        @click.stop
        >
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, watch, ref, type Ref } from 'vue';

// ####################################   PROPS   ##############
export interface Props {
    visible?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
    visible: false,
});

// ####################################   EMITS   ##############
const emit = defineEmits(['close']);

// ####################################   DATA   ##############
const isVisibleModal = ref(false);
const modalOverlay: Ref<HTMLDivElement | null> = ref(null);
const modalContent: Ref<HTMLDivElement | null> = ref(null);


// ####################################   WATCH   ##############
watch(() => props.visible, async (newVale) => {
    if(newVale === true) {
        isVisibleModal.value = true;
    } else {
        isVisibleModal.value = false;
    }
});

</script>

<style scoped>
@keyframes slideIn {
    from { opacity: 0; transform: translateY(-50px); }
    to { opacity: 1; transform: translateY(0); }
}
.modal-overlay {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, .2);
    z-index: 123;
    backdrop-filter: blur(2px);
}
.modal-content {
    min-width: 150px;
    width: max-content;
    max-width: 50%;
    min-height: 50px;
    height: max-content;
    max-height: 85vh;
    overflow: auto;
    padding: 0.4rem 0.8rem;
    animation: slideIn 0.4s;
}
</style>