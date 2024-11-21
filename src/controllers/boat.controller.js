const boatModel = require('../models/boat.model.js');
const boatValidations = require('../validations/boat.validation.js');
const appError = require('../errors/appError.js');
const fs = require("fs");

const createBoat = async (req, res, next) => {
    const idUser = req.session.id;
    const { name, dormitory, restroom, maxCapacity } = req.body;
    const boatPhotoPath = req.file;

    try {
        const validation = boatValidations.createBoatValidation({ name, dormitory, restroom, maxCapacity });

        if (!validation.isValid) {
            fs.rmSync(__dirname + "/../../uploads/" + boatPhotoPath.filename);

            throw appError(validation.errors, 400);
        }


        await boatModel.createBoat(idUser, { name, dormitory, restroom, maxCapacity, boatPhotoPath: boatPhotoPath.filename });

        return res.status(201).json({
            message: "Boat created successfully",
            data: {
                name,
                dormitory,
                restroom,
                maxCapacity,
                boatPhotoPath: boatPhotoPath.filename
            }
        });
    } catch (error) {
        return next(error);
    }
};

const getBoats = async (req, res, next) => {
    const userId = req.session.id;

    try {
        const boats = await boatModel.getBoats(userId);

        return res.status(200).json(boats);
    } catch (error) {
        return next(error);
    }
};

const deleteBoat = async (req, res, next) => {
    const boatId = req.params.id;
    const userId = req.session.id;

    try {
        const boat = await boatModel.deleteBoat(boatId, userId);

        if (boat && boat.isAppError) {
            throw boat;
        }

        fs.rmSync(__dirname + "/../../uploads/" + boat.boatPhotoPath);

        return res.status(200).json({ message: "Boat deleted successfully" });
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    createBoat,
    getBoats,
    deleteBoat
};