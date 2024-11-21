const database = require('../database/config.js');

const createBoat = async (idUser, boatObject) => {
    const { name, dormitory, restroom, maxCapacity, boatImage } = boatObject;

    const create = await database.execute(`
        INSERT INTO boats (fkBoatOwner, name, dormitory, restroom, maxCapacity, boatPhotoPath) VALUES (?, ?, ?, ?, ?);
    `, [idUser, name, dormitory, restroom, maxCapacity, boatImage]);

    return create;
}


module.exports = {
    createBoat
};