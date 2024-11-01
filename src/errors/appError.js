function appError(message, statusCode) {
    const error = new Error(message);
    error.status = statusCode;
    error.isAppError = true

    return error;
}

module.exports = appError;