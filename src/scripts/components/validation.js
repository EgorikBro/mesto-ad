// Функция для отображения ошибки валидации
export const showInputError = (inputElement, errorElement, errorMessage, settings) => {
  inputElement.classList.add(settings.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(settings.errorClass);
};

// Функция для скрытия ошибки валидации
export const hideInputError = (inputElement, errorElement, settings) => {
  inputElement.classList.remove(settings.inputErrorClass);
  errorElement.textContent = "";
  errorElement.classList.remove(settings.errorClass);
};

// Функция для получения элемента ошибки
const getErrorElement = (inputElement) => {
  const inputId = inputElement.id;
  if (inputId) {
    return document.querySelector(`#${inputId}-error`);
  }
  return null;
};

// Функция для проверки валидности поля
const checkInputValidity = (inputElement, settings) => {
  const errorElement = getErrorElement(inputElement);
  if (!errorElement) return true;

  const value = inputElement.value.trim();
  let errorMessage = "";

  // Проверка на обязательность
  if (inputElement.hasAttribute("required") && !value) {
    errorMessage = inputElement.validationMessage || "Это поле обязательно для заполнения";
  }
  // Проверка паттерна для полей с data-error-message (поля имени)
  else if (inputElement.hasAttribute("data-error-message") && value) {
    const namePattern = /^[a-zA-Zа-яА-ЯёЁ\s\-]+$/;
    if (!namePattern.test(value)) {
      errorMessage = inputElement.getAttribute("data-error-message");
    } else if (!inputElement.validity.valid) {
      // Если паттерн прошел, но есть другие ошибки (например, длина)
      errorMessage = inputElement.validationMessage;
    }
  }
  // Проверка на валидность URL для полей типа url
  else if (inputElement.type === "url" && value) {
    try {
      new URL(value);
      if (!inputElement.validity.valid) {
        errorMessage = inputElement.validationMessage || "Введите корректную ссылку";
      }
    } catch {
      errorMessage = "Введите корректную ссылку";
    }
  }
  // Проверка на валидность через встроенную валидацию браузера
  else if (!inputElement.validity.valid && value) {
    errorMessage = inputElement.validationMessage;
  }

  if (errorMessage) {
    showInputError(inputElement, errorElement, errorMessage, settings);
    return false;
  } else {
    hideInputError(inputElement, errorElement, settings);
    return true;
  }
};

// Функция для проверки наличия невалидных полей в форме
const hasInvalidInput = (formElement, settings) => {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  return inputList.some((inputElement) => {
    return !checkInputValidity(inputElement, settings);
  });
};

// Функция для отключения кнопки submit
const disableSubmitButton = (buttonElement, settings) => {
  buttonElement.classList.add(settings.inactiveButtonClass);
  buttonElement.disabled = true;
};

// Функция для включения кнопки submit
const enableSubmitButton = (buttonElement, settings) => {
  buttonElement.classList.remove(settings.inactiveButtonClass);
  buttonElement.disabled = false;
};

// Функция для переключения состояния кнопки в зависимости от валидности формы
export const toggleButtonState = (formElement, settings) => {
  const submitButton = formElement.querySelector(settings.submitButtonSelector);
  if (!submitButton) return;
  
  // Проверяем все поля формы
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  let isValid = true;
  
  inputList.forEach((inputElement) => {
    if (!checkInputValidity(inputElement, settings)) {
      isValid = false;
    }
  });
  
  if (isValid) {
    enableSubmitButton(submitButton, settings);
  } else {
    disableSubmitButton(submitButton, settings);
  }
};

// Функция для установки обработчиков событий на поля формы
const setEventListeners = (formElement, settings) => {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  
  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      checkInputValidity(inputElement, settings);
      toggleButtonState(formElement, settings);
    });
    
    inputElement.addEventListener("blur", () => {
      checkInputValidity(inputElement, settings);
      toggleButtonState(formElement, settings);
    });
  });
};

// Функция для очистки ошибок валидации формы
export const clearValidation = (formElement, settings) => {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const submitButton = formElement.querySelector(settings.submitButtonSelector);
  
  inputList.forEach((inputElement) => {
    const errorElement = getErrorElement(inputElement);
    if (errorElement) {
      hideInputError(inputElement, errorElement, settings);
    }
  });
  
  disableSubmitButton(submitButton, settings);
};

// Функция для включения валидации всех форм
export const enableValidation = (settings) => {
  const formList = Array.from(document.querySelectorAll(settings.formSelector));
  
  formList.forEach((formElement) => {
    setEventListeners(formElement, settings);
    toggleButtonState(formElement, settings);
  });
};

