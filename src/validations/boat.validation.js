const createBoatValidation = ({ name, dormitory, restroom, maxCapacity }) => {
    const errors = [];

    dormitory = parseInt(dormitory);
    restroom = parseInt(restroom);
    maxCapacity = parseInt(maxCapacity);

    if (!name || !maxCapacity) {
        errors.push("Name and max capacity are required fields.");

        return {
            errors,
            isValid: errors.length === 0
        }
    }

    if (name && name.length > 50) {
        errors.push("Name cannot be longer than 50 characters.");
    }


    if (isNaN(maxCapacity)) {
        errors.push("Max capacity must be a number.");
    }

    if (isNaN(restroom)) {
        errors.push("Restroom must be a number. (0 or 1)");
    }

    if (isNaN(dormitory)) {
        errors.push("Dormitory must be a number. (0 or 1)");
    }

    if (dormitory !== 0 && dormitory !== 1) {
        errors.push("Dormitory must be 0 or 1 (boolean).");
    }

    if (restroom !== 0 && restroom !== 1) {
        errors.push("Restroom must be 0 or 1 (boolean).");
    }

    if (maxCapacity < 1) {
        errors.push("Max capacity must be greater than 0.");
    }


    return {
        errors,
        isValid: errors.length === 0
    }
}

module.exports = {
    createBoatValidation
}