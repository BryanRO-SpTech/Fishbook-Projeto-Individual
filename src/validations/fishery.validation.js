const createFisheryValidation = ({
    fisheryPointName,
    fisheryPointLat,
    fisheryPointLon,
    dateTimeDeparture,
    dateTimeReturn,
    lunchIncludes,
    price,
    fkBoat,
    fkHarbor
}) => {
    const errors = [];

    if (!fisheryPointName || !fisheryPointLat || !fisheryPointLon || !dateTimeDeparture || !dateTimeReturn || !price || !fkBoat || !fkHarbor) {
        errors.push("All fields are required.");

        return {
            errors,
            isValid: errors.length === 0
        };
    }

    if (fisheryPointName.length > 20) {
        errors.push("Fishery point name cannot be longer than 50 characters");
    }

    if (isNaN(fisheryPointLat)) {
        errors.push("Fishery point latitude must be a number");
    }

    if (isNaN(fisheryPointLon)) {
        errors.push("Fishery point longitude must be a number");
    }

    if (new Date(dateTimeDeparture) < new Date()) {
        errors.push("Departure date and time must be greater than current date and time");
    }

    if (new Date(dateTimeDeparture) > new Date(dateTimeReturn)) {
        errors.push("Return date and time must be greater than departure date and time");
    }

    if (isNaN(Date.parse(new Date(dateTimeDeparture)))) {
        errors.push("Departure date and time must be a valid date");
    }

    if (isNaN(Date.parse(new Date(dateTimeReturn)))) {
        errors.push("Return date and time must be a valid date");
    }

    if (lunchIncludes !== 0 && lunchIncludes !== 1) {
        errors.push("Lunch includes must be 0 or 1");
    }

    if (isNaN(price)) {
        errors.push("Price must be a number");
    }

    if (isNaN(fkBoat)) {
        errors.push("Boat must be a number");
    }

    if (isNaN(fkHarbor)) {
        errors.push("Harbor must be a number");
    }

    return {
        errors,
        isValid: errors.length === 0
    };
}

module.exports = {
    createFisheryValidation
}