const database = require("../database/config.js");
const appError = require("../errors/appError.js");

const createFishery = async (userId, {
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
    const [boat] = await database.execute(
        `SELECT * FROM Boat WHERE idBoat = ? AND fkBoatOwner = ?`,
        [fkBoat, userId]
    );

    if (!boat) {
        return appError("Boat does not belong to you or not exists", 404);
    }



    const [harbor] = await database.execute(
        `SELECT * FROM Harbor WHERE idHarbor = ?`,
        [fkHarbor]
    );

    if (!harbor) {
        return appError("Harbor does not exist", 404);
    }

    const [fisheryInSamePeriod] = await database.execute(
        `SELECT * FROM Fishery WHERE fkBoat = ? AND (dateTimeDeparture >= ? AND dateTimeReturn <= ?)`,
        [boat.idBoat, dateTimeDeparture, dateTimeReturn]
    );

    if (fisheryInSamePeriod) {
        return appError(`The boat ${boat.name} already has a fishery in this period`, 400);
    }

    await database.execute(
        `INSERT INTO Fishery (fisheryPointName, fisheryPointLat, fisheryPointLon, dateTimeDeparture, dateTimeReturn, lunchIncludes, price, fkBoat, fkHarbor)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [fisheryPointName, fisheryPointLat, fisheryPointLon, dateTimeDeparture, dateTimeReturn, lunchIncludes, price, fkBoat, fkHarbor]
    );

    return true;
}

const getFisheriesByHarborId = async (harborId) => {
    const fisheries = await database.execute(
        `SELECT Fishery.*, Boat.name AS boatName FROM Fishery 
        JOIN Boat ON fkBoat = idBoat
        WHERE fkHarbor = ?`,
        [harborId]
    );

    return fisheries;
}

module.exports = {
    createFishery,
    getFisheriesByHarborId
}