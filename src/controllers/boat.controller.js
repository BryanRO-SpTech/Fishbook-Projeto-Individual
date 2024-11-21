const boatModel = require('../models/boat.model.js');

const createBoat = async (req, res, next) => {
    const idUser = req.session.id;
    const { name, dormitory, restroom, maxCapacity } = req.body;
    const boatPhotoPath = req.file;


    try {
        const create = await boatModel.createBoat(idUser, { name, dormitory, restroom, maxCapacity, boatPhotoPath: boatPhotoPath.filename });

        return res.status(201).json({
            message: "Boat created successfully",
            data: create
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    createBoat
};