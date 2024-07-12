
import { onMounted, ref, type Ref, computed, watch } from 'vue';
import { getContacts } from '@/api/contactsApi';
import { useMainStore } from '@/stores/mainStore';
import type { Contact } from '@/types';

export default function useMainComposable() {


    const mainStore = useMainStore();

    const searchContactsByName = ref('');
    const isSearchEmpty = ref(false);
    const visibleCreationContactForm = ref(false);
    const visibleEditionContactForm = ref(false);
    const visibleDeleteContactForm = ref(false);
    const isLoadingContacts = ref(false);
    const editionContentData: Ref<Contact | null> = ref(null);
    const deleteContentData: Ref<Contact | null> = ref(null);


    // Обработчик открытия формы удаления контакта
    function handlerOpenDeleteForm(contact: Contact) {
        visibleDeleteContactForm.value = true;
        deleteContentData.value = contact;
    }

    // Обработчик очистки формы удаления (при успешном выполнении запроса на удаление контакта)
    function handlerResetDeleteForm() {
        deleteContentData.value = null
    }

    // Обработчик открытия формы редактирования контакта
    function handlerOpenEditionForm(contact: Contact) {
        visibleEditionContactForm.value = true;
        editionContentData.value = contact;
    }

    // Обработчик очистки формы редактирования (при успешном выполнении запроса на редактирование контакта)
    function handlerResetEditForm() {
        editionContentData.value = null;
    }

    const searchByName = computed(() => {
        return mainStore.contacts.filter((contact) => {
            if (contact.contactName.toLocaleLowerCase().includes(searchContactsByName.value.toLocaleLowerCase())) {
                return true;
            }
            else return false;
        });
    });

    watch(() => searchByName.value.length, (newLength) => {
        if (newLength <= 0 && searchContactsByName.value.length) isSearchEmpty.value = true;
        else isSearchEmpty.value = false;
    })

    onMounted(async () => {
        try {
            isLoadingContacts.value = true;
            mainStore.contacts = await getContacts();
        } catch (err) {
            console.error('Не удалось получить контакты')
            mainStore.mutateVisibledNotice({ label: 'Не удалось загрузить контакты', type: 'error', lifecyle: 3000 });
        } finally {
            isLoadingContacts.value = false;
        }

    })
    return {
        searchContactsByName,
        isSearchEmpty,
        visibleCreationContactForm,
        visibleEditionContactForm,
        visibleDeleteContactForm,
        isLoadingContacts,
        editionContentData,
        deleteDContentData: deleteContentData,
        searchByName,
        handlerOpenDeleteForm,
        handlerResetDeleteForm,
        handlerOpenEditionForm,
        handlerResetEditForm,
    }
}