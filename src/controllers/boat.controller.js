const boatModel = require('../models/boat.model.js');

const createBoat = async (req, res, next) => {
    const idUser = req.session.id;
    const { name, dormitory, restroom, maxCapacity, boatImage } = req.body;

    try {
        const create = await boatModel.createBoat(idUser, { name, dormitory, restroom, maxCapacity, boatImage });

        return res.status(201).json({
            message: "Boat created successfully",
            data: create
        });
    } catch (error) {
        return next(error);
    }
};