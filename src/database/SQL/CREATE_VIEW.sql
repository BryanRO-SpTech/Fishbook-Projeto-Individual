USE fishbook;

CREATE VIEW UserInfos AS 
SELECT 
    User.idUser, 
    User.username, 
    (SELECT COUNT(*) FROM Likes WHERE Likes.fkPost IN (SELECT idPost FROM Post WHERE Post.fkPostOwner = User.idUser)) AS quantLikes,
    COUNT(Post.idPost) AS quantPosts,
    (SELECT COUNT(*) FROM Friends WHERE fkUser1 = idUser XOR fkUser2 = idUser) AS quantFriends,
    (SELECT COUNT(*) FROM ProfileVisit WHERE fkUser = User.idUser) AS quantVisits,
    (SELECT COUNT(*) FROM UserFishery WHERE idUser = UserFishery.fkUser) AS quantFisheries
FROM User
LEFT JOIN Post ON fkPostOwner = idUser
GROUP BY idUser;