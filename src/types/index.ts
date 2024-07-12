
// Применяется для объявления объекта контакта при возвращаении с "сервера" или около того
export interface Contact {
    id?: number,
    contactName: string,
    email: string,
    phoneNumber: string,
}