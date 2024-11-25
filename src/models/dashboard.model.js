const database = require("../database/config.js");
const userModel = require("./user.model.js");
const friendsModel = require("./friends.model.js");
const postsModel = require("./post.model.js");

const profileKpis = async (userId) => {
    const [userInfos] = await database.execute(
        `SELECT * FROM UserInfos WHERE idUser = ?`,
        [userId]
    );

    return userInfos;
}

const profileLikesGroupByMonth = async (userId) => {
    const profileLikes = await database.execute(
        `SELECT 
        YEAR(likes.dateTime) AS year, 
        DATE_FORMAT(likes.dateTime, '%b') AS month, 
        COUNT(*) AS quantLikes 
        FROM Likes 
        JOIN Post ON fkPost = idPost 
        WHERE fkPostOwner = ?
        GROUP BY YEAR(likes.dateTime), MONTH(likes.dateTime), DATE_FORMAT(likes.dateTime, '%b')
        ORDER BY YEAR(likes.dateTime) DESC, MONTH(likes.dateTime) DESC LIMIT 12`,
        [userId]
    );

    return profileLikes.reverse();
}

const profileVisitsGroupByMonth = async (userId) => {
    const profileVisits = await database.execute(
        `SELECT YEAR(dateTime) AS Year, DATE_FORMAT(ProfileVisit.dateTime, '%b') AS Month, COUNT(*) AS quantVisits 
            FROM ProfileVisit 
            WHERE fkUser = ?
            GROUP BY MONTH(dateTime), YEAR(dateTime), DATE_FORMAT(ProfileVisit.dateTime, '%b')
            ORDER BY YEAR(dateTime) DESC, MONTH(dateTime) DESC LIMIT 12`,
        [userId]
    );

    return profileVisits.reverse();
}

const profileUsageTimeGroupByWeek = async (userId) => {
    const profileUsageTime = await database.execute(
        `SELECT DAYNAME(date) AS weekDay, usageTimeInMinutes FROM usagetime WHERE fkUser = ? ORDER BY date DESC LIMIT 7`,
        [userId]
    );

    return profileUsageTime.reverse();
}

const profileFisheryReserved = async (userId) => {
    const profileFisheryReserved = await database.execute(
        `SELECT DATE_FORMAT(dateTimeDeparture, '%b') AS month, COUNT(*) AS quantFisheries FROM fishery
        JOIN userfishery ON fkFishery = idFishery
        WHERE fkUser = ?
        GROUP BY MONTH(dateTimeDeparture), YEAR(dateTimeDeparture), DATE_FORMAT(dateTimeDeparture, '%b')
        ORDER BY MONTH(dateTimeDeparture) DESC, YEAR(dateTimeDeparture) DESC LIMIT 12`,
        [userId]
    );

    return profileFisheryReserved.reverse();
}

module.exports = {
    profileKpis,
    profileLikesGroupByMonth,
    profileVisitsGroupByMonth,
    profileUsageTimeGroupByWeek,
    profileFisheryReserved
}

