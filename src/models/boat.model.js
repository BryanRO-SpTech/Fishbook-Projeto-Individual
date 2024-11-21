const database = require('../database/config.js');
const appError = require('../errors/appError.js');

const createBoat = async (idUser, boatObject) => {
    const { name, dormitory, restroom, maxCapacity, boatPhotoPath } = boatObject;

    const create = await database.execute(`
        INSERT INTO Boat (fkBoatOwner, name, dormitory, restroom, maxCapacity, boatPhotoPath) VALUES (?, ?, ?, ?, ?, ?);
    `, [idUser, name, parseInt(dormitory), parseInt(restroom), parseInt(maxCapacity), boatPhotoPath]);

    return create;
}


const getBoats = (userId) => {
    const boats = database.execute(`
        SELECT * FROM Boat WHERE fkBoatOwner = ?;
    `, [userId]);

    return boats;
}

const deleteBoat = async (boatId, userId) => {
    const [boat] = await database.execute(`
        SELECT * FROM Boat WHERE idBoat = ? && fkBoatOwner = ?;
    `, [boatId, userId]);

    if (!boat) {
        return appError("This boat does not belong to you or not exists", 404);
    }

    const getFishiries = await database.execute(`
        SELECT * FROM Fishery WHERE fkBoat = ?;
    `, [boatId]);

    if (getFishiries.length > 0) {
        return appError("Boat has fishiries, delete them first", 400);
    }

    await database.execute(`
        DELETE FROM Boat WHERE idBoat = ?;
    `, [boatId]);

    return boat;
}

module.exports = {
    createBoat,
    getBoats,
    deleteBoat
};