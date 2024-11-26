const database = require("../database/config.js");

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
        YEAR(Likes.dateTime) AS year, 
        DATE_FORMAT(Likes.dateTime, '%b') AS month, 
        COUNT(*) AS quantLikes 
        FROM Likes 
        JOIN Post ON fkPost = idPost 
        WHERE fkPostOwner = ?
        GROUP BY YEAR(Likes.dateTime), MONTH(Likes.dateTime), DATE_FORMAT(Likes.dateTime, '%b')
        ORDER BY YEAR(Likes.dateTime) DESC, MONTH(Likes.dateTime) DESC LIMIT 12`,
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
        `SELECT DAYNAME(date) AS weekDay, usageTimeInMinutes FROM UsageTime WHERE fkUser = ? ORDER BY date DESC LIMIT 7`,
        [userId]
    );

    return profileUsageTime.reverse();
}

const profileFisheryReserved = async (userId) => {
    const profileFisheryReserved = await database.execute(
        `SELECT DATE_FORMAT(dateTimeDeparture, '%b') AS month, COUNT(*) AS quantFisheries FROM Fishery
        JOIN UserFishery ON fkFishery = idFishery
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

