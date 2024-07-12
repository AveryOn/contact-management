import type { FormDataContact } from '@/types/contactForm.type';
import { useMainStore } from '@/stores/mainStore';
import type { Contact } from '@/types';
import useValidator from '@/composables/validatorComposable';
const { checkUniqueEmail, checkUniquePhoneNumber } = useValidator();

// Получение всех контактов
export function getContacts(): Promise<Array<Contact> | []> {
    return new Promise((resolve, reject) => {
        try {
            let contactsOfStorage: Array<Contact> | string | null = localStorage.getItem('contacts');
            if(!contactsOfStorage) {
                localStorage.setItem('contacts', JSON.stringify([])); 
                return setTimeout(() => {
                    resolve([]);
                }, 523);
            }
            contactsOfStorage = JSON.parse(contactsOfStorage);
            if(Array.isArray(contactsOfStorage)) {
                setTimeout(() => {
                    resolve(contactsOfStorage)
                }, 523);
            }
        } catch (err) {
            console.error('@/api/creationNewContact => ', err);
            reject(err);
        }
    });
}

// Создание нового контакта
export function creationNewContact({ contactName, email, phoneNumber }: FormDataContact): Promise<Contact> {
    const mainStore = useMainStore();
    return new Promise((resolve, reject) => {
        try {
            let contactsOfStorage: Array<FormDataContact> | string | null = localStorage.getItem('contacts');
            if(!contactsOfStorage) localStorage.setItem('contacts', JSON.stringify([])); 
            if(typeof contactsOfStorage === 'string') contactsOfStorage = JSON.parse(contactsOfStorage);
            if(Array.isArray(contactsOfStorage)) {
                if(checkUniqueEmail(null, email, contactsOfStorage) === false) {
                    mainStore.mutateVisibledNotice({ label: 'Контакт с таким E-mail уже существует', lifecyle: 3000, type: 'error' });
                    throw 'Контакт с таким E-mail уже существует';
                }
                if(checkUniquePhoneNumber(null, phoneNumber, contactsOfStorage) === false) {
                    mainStore.mutateVisibledNotice({ label: 'Контакт с таким номером телефона уже существует', lifecyle: 3000, type: 'error' });
                    throw 'Контакт с таким номером телефона уже существует';
                }
                const newId = Date.now()
                contactsOfStorage.push({ id: newId, contactName, email, phoneNumber });
                localStorage.setItem('contacts', JSON.stringify(contactsOfStorage));
                setTimeout(() => {
                    resolve({ id: newId, contactName, email, phoneNumber });
                }, 523);
            }
        } catch (err) {
            console.error('@/api/creationNewContact => ', err);
            reject(err);
        }
    });
}

// Редактирование контакта
export function editContact(contact: Contact): Promise<Contact> {
    const mainStore = useMainStore();
    return new Promise((resolve, reject) => {
        try {
            let contactsOfStorage: Array<Contact> = JSON.parse(localStorage.getItem('contacts')!);
            if(Array.isArray(contactsOfStorage)) {
                if(checkUniqueEmail(contact.id!, contact.email, contactsOfStorage) === false) {
                    mainStore.mutateVisibledNotice({ label: 'Контакт с таким E-mail уже существует', lifecyle: 3000, type: 'error' });
                    throw 'Контакт с таким E-mail уже существует';
                }
                if(checkUniquePhoneNumber(contact.id!, contact.phoneNumber, contactsOfStorage) === false) {
                    mainStore.mutateVisibledNotice({ label: 'Контакт с таким номером телефона уже существует', lifecyle: 3000, type: 'error' });
                    throw 'Контакт с таким номером телефона уже существует';
                }
                contactsOfStorage = contactsOfStorage.map((item: Contact) => {
                    if(item.id === contact.id) return contact;
                    else return item;
                });
                localStorage.setItem('contacts', JSON.stringify(contactsOfStorage));
                setTimeout(() => {
                    resolve(contact);
                }, 523);
            } 
        } catch (err) {
            console.error('@/api/editContact => ', err);
            reject(err);
        }
    });
}

// Удаление контакта
export function deleteContact(contactId: number): Promise<Array<Contact>> {
    return new Promise((resolve, reject) => {
        try {
            let contactsOfStorage: Array<Contact> = JSON.parse(localStorage.getItem('contacts')!);
            if(Array.isArray(contactsOfStorage)) {
                contactsOfStorage = contactsOfStorage.filter((item: Contact) => {
                    if(item.id !== contactId) return true;
                    else return false;
                });
                localStorage.setItem('contacts', JSON.stringify(contactsOfStorage));
                setTimeout(() => {
                    resolve(contactsOfStorage);
                }, 523);
            } 
        } catch (err) {
            console.error('@/api/deleteContact => ', err);
            reject(err);
        }
    });
}