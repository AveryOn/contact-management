
// Функция формирует из строки номер телефона по шаблону
export function replacePhoneNumber(phoneNumber: string): string {
    const phoneNumberRegex = /(\d{3})(\d{3})(\d{2})(\d{2})/;
    return phoneNumber.replace(phoneNumberRegex, "+7 ($1) $2-$3-$4");
};

// функция исключает из номера телефона спецсимволы приводя его в примерный вид 9991232255
export function resetPhoneNumberMask(phoneNumber: string): string {
    let sourceNumber = phoneNumber.split("");
    let readyValue: Array<string> = [];
    let excludedChars = "+()- _";
    sourceNumber.forEach((char) => {
        if (!excludedChars.includes(char)) {
            readyValue.push(char);
        }
    });
    return readyValue.join("").slice(1);
};
