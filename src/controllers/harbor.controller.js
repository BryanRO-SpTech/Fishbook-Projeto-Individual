const harborModel = require("../models/harbor.model.js");

const getHarbors = async (req, res, next) => {
    try {
        const harbors = await harborModel.getHarbors();

        return res.status(200).json(harbors);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getHarbors
}