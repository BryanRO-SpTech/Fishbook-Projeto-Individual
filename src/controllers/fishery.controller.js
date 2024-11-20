const fisheryModel = require('../models/fishery.model.js');

const getFisheriesByHarborId = async (req, res, next) => {
    try {
        const { harborId } = req.params;
        const fisheries = await fisheryModel.getFisheriesByHarborId(harborId);

        return res.status(200).json(fisheries);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getFisheriesByHarborId
}