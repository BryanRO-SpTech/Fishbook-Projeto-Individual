function errorHandler(error, req, res, next) {
    let statusCode = 500;
    let message = "Internal server error";

    if (error.isAppError) {
        message = error.message;
        statusCode = error.status;
    } else {
        console.log(error);
    }


    return res.status(statusCode).json({
        status: "error",
        statusCode,
        message
    });
}

module.exports = errorHandler;