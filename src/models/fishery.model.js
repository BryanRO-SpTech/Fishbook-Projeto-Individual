const database = require("../database/config.js");

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
    getFisheriesByHarborId
}