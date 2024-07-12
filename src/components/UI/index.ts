// Файл для объединения компонентов, которые необходимо зарегистрировать глобально в приложении 

import inputComp from "./inputComp.vue";
import buttonComp from "./buttonComp.vue";
import modalComp from './modalComp.vue';
import noticeComp from "./noticeComp.vue";
import spinnerComp from './spinnerComp.vue';

inputComp.name = 'inputComp';
buttonComp.name = 'buttonComp';
modalComp.name = 'modalComp';
noticeComp.name = 'noticeComp';
spinnerComp.name = 'spinnerComp';

export default [
    inputComp,
    buttonComp,
    modalComp,
    noticeComp,
    spinnerComp,
]