    "use strict"

    const generateError = (message, code = 500) => {
        const error = new Error(message);
        error.httpStatus = code;
        throw error;
    };