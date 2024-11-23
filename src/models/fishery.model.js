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
        return appError("This boat already has a fishery in this period", 400);
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

const getFisheriesCreatedByUser = (userId) => {
    const fisheries = database.execute(
        `
        SELECT Fishery.*, Harbor.name AS harborName, Boat.name AS boatName FROM Fishery
        JOIN Harbor ON fkHarbor = idHarbor
        JOIN Boat ON fkBoat = idBoat
        WHERE Boat.fkBoatOwner = ?
        `,
        [userId]
    );

    return fisheries;
}

const getFisheriesReservedByUser = async (userId) => {
    const fisheries = database.execute(
        `
        SELECT Fishery.*, Boat.name AS boatName FROM Fishery
        JOIN Boat ON fkBoat = idBoat
        JOIN UserFishery ON fkFishery = idFishery
        WHERE fkUser = ?
        `,
        [userId]
    );

    return fisheries;
}

const deleteFishery = async (userId, fisheryId) => {
    const [fishery] = await database.execute(
        `SELECT * FROM Fishery 
        JOIN Boat ON fkBoat = idBoat
        WHERE Fishery.idFishery = ? AND Boat.fkBoatOwner = ?`,
        [fisheryId, userId]
    );

    if (!fishery) {
        return appError("This fishing was not created by you", 400);
    }

    await database.execute(
        `DELETE FROM Fishery WHERE idFishery = ?`,
        [fisheryId]
    );
};

module.exports = {
    createFishery,
    getFisheriesByHarborId,
    getFisheriesCreatedByUser,
    getFisheriesReservedByUser,
    deleteFishery
}