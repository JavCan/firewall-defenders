// Validar que un objeto tenga todas las propiedades requeridas
export const validateRequiredFields = (obj, requiredFields) => {
  const missingFields = [];
  
  for (const field of requiredFields) {
    if (obj[field] === undefined || obj[field] === null || obj[field] === '') {
      missingFields.push(field);
    }
  }
  
  return {
    valid: missingFields.length === 0,
    missingFields
  };
};

// Validar formato de email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validar que un valor sea numérico
export const isNumeric = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

// Validar formato de fecha (YYYY-MM-DD)
export const isValidDate = (dateString) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

// Validar formato de hora (HH:MM:SS)
export const isValidTime = (timeString) => {
  const regex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
  return regex.test(timeString);
};