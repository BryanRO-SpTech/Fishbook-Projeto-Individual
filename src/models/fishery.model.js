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

const getFisheriesByHarborId = async (harborId, userId) => {
    const fisheries = await database.execute(
        `SELECT Fishery.*, Boat.name AS boatName FROM Fishery 
        JOIN Boat ON fkBoat = idBoat
        WHERE fkHarbor = ? AND fkBoatOwner != ? AND Fishery.dateTimeDeparture > NOW() ORDER BY dateTimeDeparture DESC`,
        [harborId, userId]
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
        WHERE fkUser = ? ORDER BY dateTimeDeparture DESC
        `,
        [userId]
    );

    return fisheries;
}

const getFisheryById = async (fisheryId, userId) => {
    const [fishery] = await database.execute(
        `SELECT 
    Fishery.*, 
    Boat.name AS boatName,
    Boat.dormitory,
    Boat.restroom,
    Boat.boatPhotoPath,
    Harbor.idHarbor,
    Harbor.name AS harborName,
    Harbor.latitude AS harborLatitude,
    Harbor.longitude AS harborLongitude,
    Harbor.street,
    Harbor.number,
    boat.maxCapacity,
    (boat.maxCapacity - (SELECT COUNT(fkUser) FROM userfishery WHERE fkFishery = ?)) AS availableCapacity,
    CASE 
        WHEN Boat.fkBoatOwner = ? THEN 1
        ELSE 0
        END AS isCreatedByUser,
    CASE 
        WHEN UserFishery.fkUser = ? THEN 1  
        ELSE 0
    END AS isReservedByUser
    FROM Fishery
    JOIN Boat ON fkBoat = idBoat
    JOIN Harbor ON fkHarbor = idHarbor
    LEFT JOIN UserFishery ON fkFishery = idFishery AND fkUser = ?
    WHERE idFishery = ?;
        `,
        [fisheryId, userId, userId, userId, fisheryId]
    );

    if (!fishery) {
        return false;
    }

    return fishery;
}

const reserveFishery = async (userId, fisheryId) => {
    const [fisheryReserved] = await database.execute(
        `SELECT * FROM UserFishery WHERE fkUser = ? AND fkFishery = ?`,
        [userId, fisheryId]
    );

    if (fisheryReserved) {
        return appError("The User already reserverd this fishery", 400);
    }

    const [fishery] = await database.execute(
        `SELECT * FROM Fishery JOIN Boat ON fkBoat = idBoat WHERE fkBoatOwner = ? AND idFishery = ?`,
        [userId, fisheryId]
    );

    if (fishery) {
        return appError("You are the creator of de fishery", 400);
    }

    const [capacityReached] = await database.execute(
        `SELECT (Boat.maxCapacity - COUNT(fkFishery)) AS capacityReached FROM UserFishery
        JOIN Fishery ON fkFishery = idFishery
        JOIN Boat ON fkBoat = idBoat
        WHERE fkFishery = ?`,
        [fisheryId]
    );

    if (capacityReached && capacityReached.capacityReached === 0) {
        return appError("Maximum capacity reached", 400);
    }

    await database.execute(
        `INSERT INTO UserFishery VALUES (?, ?)`,
        [fisheryId, userId]
    );

    return true;
}

const cancelFisheryAsParticipant = async (userId, fisheryId) => {
    const [fishery] = await database.execute(
        `SELECT * FROM UserFishery WHERE fkUser = ? AND fkFishery = ?`,
        [userId, fisheryId]
    );

    if (!fishery) {
        return appError("The user has not booked this fishing trip", 400);
    }

    await database.execute(
        `DELETE FROM UserFishery WHERE fkUser = ? AND fkFishery = ?`,
        [userId, fisheryId]
    );

    return true;
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
    getFisheryById,
    reserveFishery,
    cancelFisheryAsParticipant,
    deleteFishery
}