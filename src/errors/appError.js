function appError(message, statusCode) {
    // const error = new Error(message);
    // error.status = statusCode;
    // error.isAppError = true


    const error = {
        message: message,
        status: statusCode,
        isAppError: true
    }

    return error;
}

module.exports = appError;