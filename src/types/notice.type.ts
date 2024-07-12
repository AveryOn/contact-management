
// Доступные типы уведомлений
export type NoticeTypes = 'success' | 'error' | 'info'; 

// Базовая структура состояния уведомления
export interface NoticeData {
    visible?: boolean,
    type?: NoticeTypes,
    label?: string,
    lifecyle?: number,
}