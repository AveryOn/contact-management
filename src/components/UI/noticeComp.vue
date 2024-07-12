<template>
    <div 
    class="notice-container shadow-2" 
    ref="notice"
    :class="mainStore.visibledNotice.type"
    v-show="isVisible"
    >
        <div class="notice-container__icon-block">
            <svg-icon 
            class="notice-icon mr-2" 
            type="mdi" 
            :path="computeIconNotice"
            ></svg-icon>
        </div>
        <div class="notice-container__label-block">{{ mainStore.visibledNotice.label ?? 'Notification' }}</div>
    </div>
</template>

<script setup lang="ts">
import gsap from 'gsap';
import { watch, ref, type Ref, computed } from 'vue';
import { useMainStore } from '@/stores/mainStore';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiCheck, mdiInformationOutline, mdiMessageTextOutline  } from '@mdi/js';

// ####################################   COMPOSABLES   ##############
const mainStore = useMainStore();

// ####################################   DATA   ##############
const notice: Ref<HTMLDivElement | null> = ref(null);
const isVisible = ref(true);


// ####################################   METHODS   ##############
// сбросить состояние уведомления до исходных значений
function resetVisibledNoticeData() {
    mainStore.visibledNotice.visible = false;
    mainStore.visibledNotice.label = '';
    mainStore.visibledNotice.type = 'info';
    mainStore.visibledNotice.lifecyle = 3000;
}

function showNotice() {
    isVisible.value = true;
    gsap.to(notice.value, { duration: 0.3, right: '1rem' })
        .then(() => {
            setTimeout(() => {
                collapseNotice(); // спустя lifecyle-время скрывать уведомление
            }, mainStore.visibledNotice.lifecyle);
        })
}

function collapseNotice() {
    gsap.to(notice.value, { duration: 0.3, right: '-700px;' })
        .then(() => {
            resetVisibledNoticeData(); // после анимации скрытия уведомления, обнулять его состояние
            isVisible.value = false;
        })
}

// ####################################   COMPUTED   ##############
// вычисляет текущий тип  уведомления
const computeIconNotice = computed(() => {
    if(mainStore.visibledNotice.type === 'error') return mdiInformationOutline;
    if(mainStore.visibledNotice.type === 'info') return mdiMessageTextOutline;
    if(mainStore.visibledNotice.type === 'success') return mdiCheck;
});


// ####################################   WATCH   ##############
// относит. visible-флага показывать увед. или скрывать
watch(() => mainStore.visibledNotice.visible, (isVisible) => {
    if(isVisible === true) {
        showNotice();
    } else {
        collapseNotice();
    }
})

</script>

<style scoped>
.notice-container {
    position: fixed;
    top: 1rem;
    z-index: 9999;
    right: -700px;
    display: flex;
    align-items: center;
    border-radius: var(--cm-radius);
    padding: 0.3rem 1rem;
    color: var(--notice-fg);
}
.notice-container.error {
    background-color: rgba(255, 0, 0, 0.5);
}
.notice-container.success {
    background-color: rgba(111, 210, 72, 0.5);
}
.notice-container.info {
    background-color: rgba(68, 136, 209, 0.5);
}
.notice-container__icon-block {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 25px;
}
.notice-container__label-block {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
}
</style>