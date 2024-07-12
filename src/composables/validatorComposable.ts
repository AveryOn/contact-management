import { resetPhoneNumberMask } from '../utils/maskUtils';
import type { FormDataContact } from '@/types/contactForm.type';

export default function useValidator() {
    // Проверка email на уникальность
    function checkUniqueEmail(contactId: number | null, email: string, contacts: Array<FormDataContact>): boolean {
        let isUnique = true;
        try {
            if(contactId !== null) {
                contacts.forEach(({ id, email: entryEmail }) => {
                    if(id !== contactId && email === entryEmail) isUnique = false;
                });
            } else {
                contacts.forEach(({ email: entryEmail }) => {
                    if(email === entryEmail) isUnique = false;
                });
            }
        } catch (err) {
            console.error('@/composables/useValidator/checkUniqueEmail => ', err);
        }
        return isUnique;
    }
    // Проверка номера телефона на уникальность
    function checkUniquePhoneNumber(contactId: number | null, phoneNumber: string, contacts: Array<FormDataContact>): boolean {
        let isUnique = true;
        try {
            if(contactId !== null) {
                contacts.forEach(({ id, phoneNumber: entryPhoneNumber }) => {
                    if(contactId !== id && phoneNumber === resetPhoneNumberMask(entryPhoneNumber)) isUnique = false;
                });
            } else {
                contacts.forEach(({ phoneNumber: entryPhoneNumber }) => {
                    if(phoneNumber === resetPhoneNumberMask(entryPhoneNumber)) isUnique = false;
                });
            }
        } catch (err) {
            console.error('@/composables/useValidator/checkUniquePhoneNumber => ', err);
        }
        return isUnique;
    }
    return {
        checkUniqueEmail,
        checkUniquePhoneNumber,
    }
}