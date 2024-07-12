import { ref, reactive, type Reactive, onMounted, watch } from 'vue';
import type { ErrorState, ErrorStateScopes, FormDataContact } from '@/types/contactForm.type';
import { replacePhoneNumber, resetPhoneNumberMask } from '@/utils/maskUtils';
import { creationNewContact, editContact } from '@/api/contactsApi';
import { useMainStore } from '@/stores/mainStore';
import type { Contact } from '@/types';

// Компонуемая логика для формы создания/редактирования контакта
export default function useContactForm(props: any, emit: any) {

// ####################################   COMPOSABLES   ##############
    const mainStore = useMainStore();

// ####################################   DATA   ##############
    const isLoadingConfirmData = ref(false);
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // Общее состояние ошибок всех полей формы
    const errorsState: Reactive<ErrorState> = reactive({
        email: {
            enable: false,
            msg: '',
            empty: 'E-mail - обязательное поле',
            inccorect: 'Укажите корректный E-mail'
        },
        phoneNumber: {
            enable: false,
            msg: '',
            empty: 'Номер телефона - обязательное поле',
            length: 'Недостаточная длина номера телефона',
        },
        contactName: {
            enable: false,
            msg: '',
            empty: 'Имя контакта - обязательное поле',
            length: 'Имя контакта не может содержать менее 3 символов',
        }
    })

    const formData = reactive({
        id: 0,
        contactName: '',
        email: '',
        phoneNumber: '',
    });
    // Объект используется для сравнения с исходным объектом на предмет внесенных изменений
    const formDataCopy = {
        id: 0,
        contactName: '',
        email: '',
        phoneNumber: '',
    };

    // Валидация всех полей формы 
    function validationForm(): boolean {
        const { contactName, email, phoneNumber } = formData;
        let isNotError = true;
        // Проверка имени контакта
        if (!contactName.length) {
            errorsState.contactName.msg = errorsState.contactName.empty ?? '';
            errorsState.contactName.enable = true;
            isNotError = false;

        } else if (contactName.length < 3) {
            errorsState.contactName.msg = errorsState.contactName.length ?? '';
            errorsState.contactName.enable = true;
            isNotError = false;
        }
        // Проверка email
        if (!email.length) {
            errorsState.email.msg = errorsState.email.empty ?? '';
            errorsState.email.enable = true;
            isNotError = false;
        } else if (!emailPattern.test(email)) {
            errorsState.email.msg = errorsState.email.inccorect ?? '';
            errorsState.email.enable = true;
            isNotError = false;
        }
        // Проверка номера телефона
        if (!phoneNumber.length) {
            errorsState.phoneNumber.msg = errorsState.phoneNumber.empty ?? '';
            errorsState.phoneNumber.enable = true;
            isNotError = false;
        } else if (phoneNumber.includes('_')) {
            errorsState.phoneNumber.msg = errorsState.phoneNumber.length ?? '';
            errorsState.phoneNumber.enable = true;
            isNotError = false;
        }
        return isNotError;
    }

    // Обработчик сброса полей формы
    function handlerResetInput(errorScope: ErrorStateScopes) {
        if (errorScope === 'contactName') {
            formData.contactName = '';
            recordTolocalStorage('', errorScope);
        }
        if (errorScope === 'email') {
            formData.email = '';
            recordTolocalStorage('', errorScope);
        }
        if (errorScope === 'phoneNumber') {
            formData.phoneNumber = '';
            recordTolocalStorage('', errorScope);
        }
    }

    // Сброс состояния ошибки для какого-либо поля
    function handlerResetError(errorScope: ErrorStateScopes) {
        if (errorScope === 'contactName') {
            errorsState.contactName.enable = false;
            errorsState.contactName.msg = '';
            recordTolocalStorage('', errorScope);
        }
        if (errorScope === 'email') {
            errorsState.email.enable = false;
            errorsState.email.msg = '';
            recordTolocalStorage('', errorScope);
        }
        if (errorScope === 'phoneNumber') {
            errorsState.phoneNumber.enable = false;
            errorsState.phoneNumber.msg = '';
            recordTolocalStorage('', errorScope);
        }
    }

    // Обнуление формы и копии формы
    function resetForm() {
        formData.id = 0;
        formData.contactName = '';
        formData.email = '';
        formData.phoneNumber = '';
        formDataCopy.id = 0;
        formDataCopy.contactName = '';
        formDataCopy.email = '';
        formDataCopy.phoneNumber = '';
        if (props.editMode === true) {
            emit('resetEditForm');
        }
    }

    // Запись единицы формы в localStorage для сохранения полей формы
    function recordTolocalStorage(value: string, errorScope: ErrorStateScopes) {
        let formDataOfStorage: FormDataContact = JSON.parse(localStorage.getItem((props.editMode === true) ? 'form_edit_data' : 'form_data')!); // на данном этапе ключ form_data/form_edit_data в localStorage существует
        if (errorScope === 'phoneNumber') {
            formDataOfStorage[errorScope] = resetPhoneNumberMask(value);
            return localStorage.setItem((props.editMode === true) ? 'form_edit_data' : 'form_data', JSON.stringify(formDataOfStorage));
        }
        formDataOfStorage[errorScope] = value;
        localStorage.setItem((props.editMode === true) ? 'form_edit_data' : 'form_data', JSON.stringify(formDataOfStorage));
    }


    // Функция считывает предыдущие значения с localStorage для того чтобы вмонтировать их в форму 
    function initFormInStorage(mode: 'edit' | 'default' = 'default', editData?: Contact) {
        let formDataOfStorage = localStorage.getItem((props.editMode === true) ? 'form_edit_data' : 'form_data');
        if (mode === 'edit' && editData) {
            formData.contactName = editData.contactName;
            formData.email = editData.email;
            formData.phoneNumber = editData.phoneNumber;
            return localStorage.setItem('form_edit_data', JSON.stringify({ ...editData }));
        } else {
            if (!formDataOfStorage) return localStorage.setItem('form_data', JSON.stringify({ ...formData }));
        }
        const { contactName, email, phoneNumber } = JSON.parse(formDataOfStorage) as FormDataContact;
        formData.contactName = contactName;
        formData.email = email;
        formData.phoneNumber = phoneNumber;
    }

    // Подтвердить форму создания/редактирования компонента
    async function confirmForm() {
        try {
            // Если форма используется в режиме редактирования
            if (props.editMode === true) {
                isLoadingConfirmData.value = true;
                if (isCompareEditData(formData, formDataCopy) === true) return; // было ли изменение в форме редактирования?
                if (validationForm() === false) return;               // Валидация полей формы
                const result: Contact = await editContact(formData);  // Запрос на редактирование контакта
                mainStore.contacts = mainStore.contacts.map((item) => {
                    if (item.id === result.id) return { ...result };
                    else return item;
                });
                mainStore.mutateVisibledNotice({ label: 'Контакт успешно изменен', lifecyle: 3000, type: 'success' });
                emit('closeForm');
                resetForm();
            }
            // Обработка создания контакта
            else {
                isLoadingConfirmData.value = true;
                if (validationForm() === false) return;
                const result: Contact = await creationNewContact(formData);
                result.phoneNumber = replacePhoneNumber(result.phoneNumber);
                mainStore.contacts.push(result);
                mainStore.mutateVisibledNotice({ label: 'Контакт добавлен', lifecyle: 3000, type: 'success' });
                emit('closeForm');
                resetForm();
                // Также обнуляется форма и в localStorage
                localStorage.setItem('form_data', JSON.stringify({
                    contactName: formData.contactName,
                    email: formData.email, 
                    phoneNumber: formData.phoneNumber
                } as FormDataContact))
            }
        } catch (err) {

            console.error('Ошибка при подтверждении формы создания/редактирования контакта', err);
        } finally {
            isLoadingConfirmData.value = false;
        }
    }

    // Функция сравнивает два объекта-контакта, чтобы избежать отправки неизмененных данных
    function isCompareEditData(obj1: Contact, obj2: Contact): boolean {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);
        if (keys1.length !== keys2.length) {
            return false;
        }
        for (let key of keys1) {
            if (!keys2.includes(key)) {
                return false;
            }
            // Сравниваем значения соответствующих ключей
            if (obj1[key] !== obj2[key]) {
                return false;
            }
        }
        // Если все ключи и их значения совпадают, возвращаем true
        return true;
    }

    // Если приходит объект данных для редактирования контакта
    watch(() => props.editData, (newValue) => {
        if (newValue) {
            const { contactName, email, phoneNumber } = newValue;
            formData.id = newValue.id!;
            formData.contactName = contactName;
            formData.email = email;
            formData.phoneNumber = phoneNumber;
            // Заполнение копии объекта для проверки объекта на внесенные изменения
            formDataCopy.id = newValue.id!;
            formDataCopy.contactName = contactName;
            formDataCopy.email = email;
            formDataCopy.phoneNumber = phoneNumber;
            initFormInStorage('edit', newValue);
        }
    }, { deep: true });

    onMounted(() => {
        initFormInStorage('default');
    })
    return {
        isLoadingConfirmData,
        errorsState,
        formData,
        handlerResetError,
        handlerResetInput,
        recordTolocalStorage,
        confirmForm,
    }
}