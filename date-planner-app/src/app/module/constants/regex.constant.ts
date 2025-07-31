export const REGEX_VALIDATION_PATTERNS = {
    name: /^[a-zA-Z áéíóúÁÉÍÓÚñÑ]{2,}$/,
    text: /^[a-zA-Z0-9.áéíóúÁÉÍÓÚñÑ]{2,}$/,
    textarea: /^[a-zA-Z0-9., áéíóúÁÉÍÓÚñÑ]{2,}$/,
    numeric: /^[0-9]{1,}$/,
    phone: /^[0-9]{10,}$/,
    zipCode: /^[0-9]{5}$/,
    email: /^[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\.[a-zA-Z]{2,}$/,
    curp: /^[A-Z]{4}[0-9]{6}[HM]{1}[A-Z]{5}[A-Z0-9]{1}[0-9]{1}$/,
    policy: /^(\d{3,4})[-]{1}(\d{0,12})[-]{1}(\d{2})$/,
    password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!¡#$%&'()*+,\-./:;<=>¿?@[\\\]^_`{|}~])[A-Za-z\d!¡#$%&'()*+,\-./:;<=>¿?@[\\\]^_`{|}~Ññ]{12,}$/,
    currency: /^(?!0.00)[\d,]{1,}(\.\d{2})?$/,
    pdfFileName: /^([a-zA-Z0-9-_ ()]+)\.([pP]{1}[dD]{1}[fF]{1})$/,
    imageFileName: /^([a-zA-Z0-9-_ ()]+)\.(([pP]{1}[nN]{1}[gG]{1})|([jJ]{1}[pP]{1}[gG]{1})|([jJ]{1}[pP]{1}[eE]{1}[gG]{1}))$/
};

export const REGEX_CHARS_ALLOWED = {
    onlyLetters: /^[a-zA-Z áéíóúÁÉÍÓÚñÑ]+$/,
    onlyNumbers: /^[0-9]+$/,
    email: /^[a-zA-Z0-9@._-]+$/,
    curp: /^[a-zA-Z0-9]+$/,
    policy: /^[0-9-]+$/,
    password: /^[\x21-\x7EñÑ]+$/,
    currecy: /[$,]/g,
    allowAll: /.+/g,
};

