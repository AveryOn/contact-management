<template>
    <button class="button py-1" :id="`${props.id ?? ''}`">
        <svg-icon
        v-if="!!props.icon"
        class="button-icon" 
        type="mdi" 
        :path="props.icon ?? ''"
        ></svg-icon>
        <!-- если у кнопки нет текстового содержимого а только иконка, то отступ слева текста убирается, чтобы иконка чувствовала себя комфортно-->
        <span class="button-inner" :class="($slots.default)? 'ml-1' : ''">
            <slot></slot>
        </span>
    </button>
</template>

<script setup lang="ts">
import SvgIcon from '@jamescoyle/vue-icon';
import { defineProps } from 'vue';
// ####################################   PROPS   ##############
export interface Props {
    id?: number | string,
    icon?: string,
}
const props = withDefaults(defineProps<Props>(), {
    id: '',
});
</script>

<style scoped>
.button {
    display: flex;
    align-items: center;
    outline: rgba(0,0,0,0);
    border: 1px solid var(--btn-border-color);
    background-color: var(--btn-bg);
    color: var(--btn-fg);
    border-radius: var(--btn-radius);
    margin: 1px 2px;
    font-size: .9rem;
    transition: all .3s ease;
    cursor: pointer;
}
.button:hover {
    transition: all .3s ease;
    background-color: var(--btn-hover-bg);
}
.button:active {
    transition: all .1s ease;
    background-color: var(--btn-active-bg);
}
.button-icon {
    width: calc(var(--icon-size) - 1px);
    height: calc(var(--icon-size) - 1px);
}
.button-inner {
    font-size: 16px
}
</style>