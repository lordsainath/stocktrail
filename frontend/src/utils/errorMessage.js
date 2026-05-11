export const getErrorMessage = (error, fallback = 'Something went wrong') => {
  try {
    const responseMessage = error?.response?.data?.message;
    const directMessage = error?.message;

    if (typeof responseMessage === 'string' && responseMessage.trim()) {
      return responseMessage;
    }

    if (typeof directMessage === 'string' && directMessage.trim()) {
      return directMessage;
    }

    if (typeof error === 'string' && error.trim()) {
      return error;
    }

    return fallback;
  } catch {
    return fallback;
  }
};

export default getErrorMessage;