
// Объект состояния ошибки для формы создания/редактирования контакта
interface ErrorStateItem {
    enable: boolean,
    msg: string,
    empty?: string,
    inccorect?: string,
    length?: string,

}

// объект объединяющий ключи которые напрямую относятся к состоянию ошибок полей формы 
export interface ErrorState {
    email: ErrorStateItem,
    phoneNumber: ErrorStateItem,
    contactName: ErrorStateItem,
}

// Доступные Области состояния ошибок. Кол-во областей пополняется относительно количества ключей в  ErrorState
export type ErrorStateScopes = keyof ErrorState;

// Интерфейс применяется для взаимодействия с реактивными данными на клиенте. Для вовзрата от "сервера" используется интерфейс Contact
export interface FormDataContact {
    id?: number;
    contactName: string;
    email: string;
    phoneNumber: string;
}