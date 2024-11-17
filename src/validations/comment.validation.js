function commentsValidation(comment) {
    const errors = [];


    if (!comment) {
        errors.push("The comment cannot be null");
    } else {

        if (typeof comment !== "string") {
            errors.push("A comment must be a string");
        } else {
            if (comment.lenght > 255) {
                errors.push("A comment cannot be longer than 255 characters");
            }

            if (!comment.trim()) {
                errors.push("A comment cannot be empty");
            }

        }

    }


    return {
        errors,
        isValid: errors.length === 0
    }
}


module.exports = {
    commentsValidation
}
