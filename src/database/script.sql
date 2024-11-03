CREATE DATABASE Fishbook;

USE Fishbook;

CREATE TABLE User (
    idUser INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(80) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    username VARCHAR(30) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    bio VARCHAR(200),
    profilePhotoPath VARCHAR(100) UNIQUE
);

CREATE TABLE Friends (
    fkUser1 INT,
    fkUser2 INT,
    PRIMARY KEY (fkUser1, fkUser2),
    CONSTRAINT fk_Friends_User1 FOREIGN KEY (fkUser1) REFERENCES User(idUser),
    CONSTRAINT fk_Friends_User2 FOREIGN KEY (fkUser2) REFERENCES User(idUser)
);

CREATE TABLE FriendRequest (
    idFriendRequest INT PRIMARY KEY AUTO_INCREMENT,
    status VARCHAR(8) CHECK(status IN ('PENDING', 'ACCEPTED', 'REJECTED')) DEFAULT 'PENDING',
    fkSender INT NOT NULL,
    fkReceiver INT NOT NULL,
    CONSTRAINT fk_FriendRequest_Sender FOREIGN KEY (fkSender) REFERENCES User(idUser),
    CONSTRAINT fk_FriendRequest_Receiver FOREIGN KEY (fkReceiver) REFERENCES User(idUser)
);  

CREATE TABLE UsageTime (
    idUsageTime INT PRIMARY KEY AUTO_INCREMENT,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    usageTimeInMinutes INT,
    fkUser INT NOT NULL,
    CONSTRAINT fk_UsageTime_User FOREIGN KEY (fkUser) REFERENCES User(idUser)
);

CREATE TABLE Post (
    idPost INT PRIMARY KEY AUTO_INCREMENT,
    fkPostOwner INT,
    type CHAR(5) CHECK(type IN ('IMAGE', 'VIDEO')) NOT NULL,
    filePath VARCHAR(100) NOT NULL UNIQUE,
    caption VARCHAR(150),
    dateTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_Post_PostOwner FOREIGN KEY (fkPostOwner) REFERENCES User(idUser)
);

CREATE TABLE Comment (
    idComment INT PRIMARY KEY AUTO_INCREMENT,
    fkPost INT NOT NULL,
    fkCommentAuthor INT NOT NULL,
    comment VARCHAR(80),
    dateTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_Comment_Post FOREIGN KEY (fkPost) REFERENCES Post(idPost),
    CONSTRAINT fk_Comment_CommentAuthor FOREIGN KEY (fkCommentAuthor) REFERENCES User(idUser)
);

CREATE TABLE `Like` (
    idLike INT PRIMARY KEY AUTO_INCREMENT,
    fkPost INT NOT NULL,
    fkLiker INT NOT NULL,
    dateTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_Like_Post FOREIGN KEY (fkPost) REFERENCES Post(idPost),
    CONSTRAINT fk_Like_Liker FOREIGN KEY (fkLiker) REFERENCES User(idUser)
);

CREATE TABLE Notification (
    idNotification INT PRIMARY KEY AUTO_INCREMENT,
    fkReceiver INT NOT NULL,
    type CHAR(5) CHECK(type IN ('FRIEND', 'LIKE', 'COMMENT')) NOT NULL,
    fkPost INT,
    fkComment INT,
    fkLike INT,
    viewed TINYINT(1) CHECK(viewed IN (0, 1)) DEFAULT 0,
    dateTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_Notification_Receiver FOREIGN KEY (fkReceiver) REFERENCES User(idUser),
    CONSTRAINT fk_Notification_Post FOREIGN KEY (fkPost) REFERENCES Post(idPost),
    CONSTRAINT fk_Notification_Comment FOREIGN KEY (fkComment) REFERENCES Comment(idComment),
    CONSTRAINT fk_Notification_Like FOREIGN KEY (fkLike) REFERENCES `Like`(idLike)
);

CREATE TABLE Boat (
    idBoat INT PRIMARY KEY AUTO_INCREMENT,
    fkBoatOwner INT NOT NULL,
    dormitory TINYINT(1) CHECK(dormitory IN (0, 1)) DEFAULT 0 NOT NULL,
    restroom TINYINT(1) CHECK(restroom IN (0, 1)) DEFAULT 0 NOT NULL,
    maxCapacity INT NOT NULL,
    CONSTRAINT fk_Boat_BoatOwner FOREIGN KEY (fkBoatOwner) REFERENCES User(idUser)
);

CREATE TABLE BoatImages (
    idBoatImage INT PRIMARY KEY AUTO_INCREMENT,
    fkBoat INT NOT NULL,
    path VARCHAR(100) NOT NULL UNIQUE,
    CONSTRAINT BoatImages_fkBoat FOREIGN KEY (fkBoat) REFERENCES Boat(idBoat)
);

CREATE TABLE Harbor (
    idHarbor INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(45) NOT NULL,
    street VARCHAR(80) NOT NULL,
    number VARCHAR(6) NOT NULL,
    postalCode CHAR(8) NOT NULL
);

CREATE TABLE Fishery (
    idFishery INT PRIMARY KEY AUTO_INCREMENT,
    fkHarbor INT NOT NULL,
    fkBoat INT NOT NULL,
    fisheryPointName VARCHAR(60) NOT NULL,
    fisheryPointLat DECIMAL(9, 6) NOT NULL,
    fisheryPointLon DECIMAL(9, 6) NOT NULL,
    dateTimeDeparture TIMESTAMP NOT NULL,
    dateTimeArrival TIMESTAMP NOT NULL,
    lunchIncludes TINYINT(1) CHECK(lunchIncludes IN (0, 1)) DEFAULT 0 NOT NULL,
    price DECIMAL(6, 2) NOT NULL,
    CONSTRAINT fk_Fishery_Harbor FOREIGN KEY (fkHarbor) REFERENCES Harbor(idHarbor),
    CONSTRAINT fk_Fishery_Boat FOREIGN KEY (fkBoat) REFERENCES Boat(idBoat)
);

CREATE TABLE UserFishery (
    fkFishery INT,
    fkUser INT,
    PRIMARY KEY (fkFishery, fkUser),
    CONSTRAINT fk_UserFishery_Fishery FOREIGN KEY (fkFishery) REFERENCES Fishery(idFishery)
);
