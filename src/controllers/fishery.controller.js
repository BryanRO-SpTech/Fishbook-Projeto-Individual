const fisheryModel = require('../models/fishery.model.js');
const fisheryValidations = require('../validations/fishery.validation.js');
const appError = require('../errors/appError.js');
const formatDateTime = require('../utils/formatDateTime.js');

const createFishery = async (req, res, next) => {
    const userId = req.session.id;
    const { fisheryPointName, fisheryPointLat, fisheryPointLon, dateTimeDeparture, dateTimeReturn, lunchIncludes, price, fkBoat, fkHarbor } = req.body;

    try {
        const validation = fisheryValidations.createFisheryValidation({ fisheryPointName, fisheryPointLat, fisheryPointLon, dateTimeDeparture, dateTimeReturn, lunchIncludes, price, fkBoat, fkHarbor });

        if (!validation.isValid) {
            throw appError(validation.errors, 400);
        }

        const formattedDateTimeDeparture = formatDateTime(new Date(dateTimeDeparture));
        const formattedDateTimeReturn = formatDateTime(new Date(dateTimeReturn));


        const create = await fisheryModel.createFishery(userId, {
            fisheryPointName,
            fisheryPointLat,
            fisheryPointLon,
            dateTimeDeparture: formattedDateTimeDeparture,
            dateTimeReturn: formattedDateTimeReturn,
            lunchIncludes,
            price,
            fkBoat,
            fkHarbor
        });

        if (create && create.isAppError) {
            throw create;
        }

        return res.status(201).json({
            message: "Fishery created successfully"
        });
    } catch (error) {
        next(error);
    }
}

const getFisheriesByHarborId = async (req, res, next) => {
    try {
        const { harborId } = req.params;
        const fisheries = await fisheryModel.getFisheriesByHarborId(harborId);

        return res.status(200).json(fisheries);
    } catch (error) {
        next(error);
    }
}

const getFisheriesCreatedByUser = async (req, res, next) => {
    const userId = req.session.id;

    try {
        const fisheries = await fisheryModel.getFisheriesCreatedByUser(userId);

        return res.status(200).json(fisheries);
    } catch (error) {
        next(error);
    }
}

const getFisheriesReservedByUser = async (req, res, next) => {
    const userId = req.session.id;

    try {
        const fisheries = await fisheryModel.getFisheriesReservedByUser(userId);

        return res.status(200).json(fisheries);
    } catch (error) {
        return next(error)
    }
}

const deleteFishery = async (req, res, next) => {
    const userId = req.session.id;
    const fisheryId = req.params.fisheryId;

    try {
        const deleteFishery = await fisheryModel.deleteFishery(userId, fisheryId);

        if (deleteFishery && deleteFishery.isAppError) {
            throw deleteFishery;
        }

        return res.status(200).json({ message: "Fishery successfully deleted" })
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    createFishery,
    getFisheriesByHarborId,
    getFisheriesCreatedByUser,
    getFisheriesReservedByUser,
    deleteFishery
}