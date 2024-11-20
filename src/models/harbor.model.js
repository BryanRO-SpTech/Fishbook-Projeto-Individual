const database = require("../database/config.js");

const getHarbors = async () => {
    const harbors = await database.execute(
        `SELECT * FROM Harbor`
    );

    return harbors;
}

module.exports = {
    getHarbors
}