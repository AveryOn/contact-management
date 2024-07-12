import { defineStore } from "pinia";
import { reactive, type Reactive, ref, type Ref } from "vue";
import type { NoticeData } from '@/types/notice.type';
import type { Contact } from "@/types";

export const useMainStore = defineStore('mainStore', () => {

    const contacts: Ref<Array<Contact> | []> = ref([]);

    // Реактивное состояние, относительного которого напрямую отображается уведомление
    const visibledNotice: Reactive<NoticeData> = reactive({
        visible: false,
        type: 'info',
        label: '',
        lifecyle: 3000,
    });

    // активация уведомления, которая доступна во всём приложении. 
    function mutateVisibledNotice({ label, lifecyle, type }: NoticeData) {
        visibledNotice.label = label;
        visibledNotice.lifecyle = lifecyle;
        visibledNotice.type = type;
        visibledNotice.visible = true;
    }

    return {
        contacts,
        visibledNotice,

        mutateVisibledNotice
    }
});