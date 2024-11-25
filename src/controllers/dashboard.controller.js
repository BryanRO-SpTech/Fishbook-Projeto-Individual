const dashboardModel = require("../models/dashboard.model.js");

const getKpis = async (req, res, next) => {
    const userId = req.session.id;
    const username = req.session.username;

    try {
        const profileKpis = await dashboardModel.profileKpis(userId, username);

        return res.status(200).json(profileKpis);
    } catch (error) {
        return next(error);
    }
}

const getLikesGroupByMonth = async (req, res, next) => {
    const userId = req.session.id;

    try {
        const likesGroupByMonth = await dashboardModel.profileLikesGroupByMonth(userId);

        return res.status(200).json(likesGroupByMonth);
    } catch (error) {
        return next(error);
    }
}


const getProfileVisitsGroupByMonth = async (req, res, next) => {
    const userId = req.session.id;

    try {
        const profileVisitsGroupByMonth = await dashboardModel.profileVisitsGroupByMonth(userId);

        return res.status(200).json(profileVisitsGroupByMonth);
    } catch (error) {
        return next(error);
    }
}

const getProfileUsageTimeGroupByWeek = async (req, res, next) => {
    const userId = req.session.id;

    try {
        const profileUsageTimeGroupByWeek = await dashboardModel.profileUsageTimeGroupByWeek(userId);

        return res.status(200).json(profileUsageTimeGroupByWeek);
    } catch (error) {
        return next(error);
    }
}

const getProfileFisheryGroupByMonth = async (req, res, next) => {
    const userId = req.session.id;

    try {
        const profileFisheryGroupByMonth = await dashboardModel.profileFisheryReserved(userId);

        return res.status(200).json(profileFisheryGroupByMonth);
    } catch (error) {
        return next(error);
    }
}



module.exports = {
    getKpis,
    getLikesGroupByMonth,
    getProfileVisitsGroupByMonth,
    getProfileUsageTimeGroupByWeek,
    getProfileFisheryGroupByMonth
}