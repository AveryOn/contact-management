<template>
    <div>
        <!-- Прогресс спиннер -->
        <svg-icon 
        class="loading-icon" 
        type="mdi" 
        :path="mdiLoading"
        ></svg-icon>
    </div>
</template>

<script setup lang="ts">
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiLoading } from '@mdi/js';

</script>

<style scoped>
@keyframes spinner {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
.loading-icon {
    width:60px;
    height:60px;
    color: var(--icon-color);
    animation: spinner 0.6s linear infinite;
}
</style>