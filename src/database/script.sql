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
    CONSTRAINT fk_Friends_User1 FOREIGN KEY (fkUser1) REFERENCES User (idUser) ON DELETE CASCADE,
    CONSTRAINT fk_Friends_User2 FOREIGN KEY (fkUser2) REFERENCES User (idUser) ON DELETE CASCADE
);

CREATE TABLE FriendRequest (
    idFriendRequest INT PRIMARY KEY AUTO_INCREMENT,
    fkSender INT NOT NULL,
    fkReceiver INT NOT NULL,
    CONSTRAINT fk_FriendRequest_Sender FOREIGN KEY (fkSender) REFERENCES User (idUser) ON DELETE CASCADE,
    CONSTRAINT fk_FriendRequest_Receiver FOREIGN KEY (fkReceiver) REFERENCES User (idUser) ON DELETE CASCADE
);

CREATE TABLE UsageTime (
    idUsageTime INT PRIMARY KEY AUTO_INCREMENT,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    usageTimeInMinutes INT,
    fkUser INT NOT NULL,
    CONSTRAINT fk_UsageTime_User FOREIGN KEY (fkUser) REFERENCES User (idUser) ON DELETE CASCADE
);

CREATE TABLE Post (
    idPost INT PRIMARY KEY AUTO_INCREMENT,
    fkPostOwner INT,
    type CHAR(5) CHECK (type IN ('IMAGE', 'VIDEO')) NOT NULL,
    filePath VARCHAR(100) NOT NULL UNIQUE,
    caption VARCHAR(150),
    dateTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_Post_PostOwner FOREIGN KEY (fkPostOwner) REFERENCES User (idUser) ON DELETE CASCADE
);

CREATE TABLE Comment (
    idComment INT PRIMARY KEY AUTO_INCREMENT,
    fkPost INT NOT NULL,
    fkCommentAuthor INT NOT NULL,
    comment VARCHAR(80),
    dateTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_Comment_Post FOREIGN KEY (fkPost) REFERENCES Post (idPost) ON DELETE CASCADE,
    CONSTRAINT fk_Comment_CommentAuthor FOREIGN KEY (fkCommentAuthor) REFERENCES User (idUser) ON DELETE CASCADE
);

CREATE TABLE `Like` (
    idLike INT PRIMARY KEY AUTO_INCREMENT,
    fkPost INT NOT NULL,
    fkLiker INT NOT NULL,
    dateTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_Like_Post FOREIGN KEY (fkPost) REFERENCES Post (idPost) ON DELETE CASCADE,
    CONSTRAINT fk_Like_Liker FOREIGN KEY (fkLiker) REFERENCES User (idUser) ON DELETE CASCADE
);

CREATE TABLE Notification (
    idNotification INT PRIMARY KEY AUTO_INCREMENT,
    fkReceiver INT NOT NULL,
    type CHAR(9) CHECK (
        type IN ('FRIEND', 'LIKE', 'COMMENT')
    ) NOT NULL,
    fkFriendRequest INT,
    fkComment INT,
    fkLike INT,
    viewed TINYINT(1) CHECK (viewed IN (0, 1)) DEFAULT 0,
    dateTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_Notification_Receiver FOREIGN KEY (fkReceiver) REFERENCES User (idUser) ON DELETE CASCADE,
    CONSTRAINT fk_Notification_Friend_Request FOREIGN KEY (fkFriendRequest) REFERENCES FriendRequest (idFriendRequest) ON DELETE CASCADE,
    CONSTRAINT fk_Notification_Comment FOREIGN KEY (fkComment) REFERENCES Comment (idComment) ON DELETE CASCADE,
    CONSTRAINT fk_Notification_Like FOREIGN KEY (fkLike) REFERENCES `Like` (idLike) ON DELETE CASCADE
);

CREATE TABLE Boat (
    idBoat INT PRIMARY KEY AUTO_INCREMENT,
    fkBoatOwner INT NOT NULL,
    dormitory TINYINT(1) CHECK (dormitory IN (0, 1)) DEFAULT 0 NOT NULL,
    restroom TINYINT(1) CHECK (restroom IN (0, 1)) DEFAULT 0 NOT NULL,
    maxCapacity INT NOT NULL,
    CONSTRAINT fk_Boat_BoatOwner FOREIGN KEY (fkBoatOwner) REFERENCES User (idUser) ON DELETE CASCADE
);

CREATE TABLE BoatImages (
    idBoatImage INT PRIMARY KEY AUTO_INCREMENT,
    fkBoat INT NOT NULL,
    path VARCHAR(100) NOT NULL UNIQUE,
    CONSTRAINT BoatImages_fkBoat FOREIGN KEY (fkBoat) REFERENCES Boat (idBoat) ON DELETE CASCADE
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
    lunchIncludes TINYINT(1) CHECK (lunchIncludes IN (0, 1)) DEFAULT 0 NOT NULL,
    price DECIMAL(6, 2) NOT NULL,
    CONSTRAINT fk_Fishery_Harbor FOREIGN KEY (fkHarbor) REFERENCES Harbor (idHarbor) ON DELETE CASCADE,
    CONSTRAINT fk_Fishery_Boat FOREIGN KEY (fkBoat) REFERENCES Boat (idBoat) ON DELETE CASCADE
);

CREATE TABLE UserFishery (
    fkFishery INT,
    fkUser INT,
    PRIMARY KEY (fkFishery, fkUser),
    CONSTRAINT fk_UserFishery_Fishery FOREIGN KEY (fkFishery) REFERENCES Fishery (idFishery) ON DELETE CASCADE
);

-- Insere 30 usuários na tabela User, com senha em hash e foto de perfil nula
INSERT INTO User (name, email, username, password, bio, profilePhotoPath) VALUES
('Alice Silva', 'alice.silva@example.com', 'alice123', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Amante de leitura e natureza', NULL),
('Bruno Costa', 'bruno.costa@example.com', 'brunoc', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Fotógrafo e viajante', NULL),
('Carla Souza', 'carla.souza@example.com', 'carla.s', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Apaixonada por tecnologia', NULL),
('Daniel Oliveira', 'daniel.oliveira@example.com', 'danioliveira', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Escritor em tempo livre', NULL),
('Eduarda Santos', 'eduarda.santos@example.com', 'eduardinha', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Amante dos animais', NULL),
('Felipe Lima', 'felipe.lima@example.com', 'felipelima', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Engenheiro de software', NULL),
('Gabriela Almeida', 'gabriela.almeida@example.com', 'gabialmeida', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Desenvolvedora front-end', NULL),
('Henrique Souza', 'henrique.souza@example.com', 'h.souza', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Analista de sistemas', NULL),
('Isabela Rodrigues', 'isabela.rodrigues@example.com', 'belinha', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Bailarina e dançarina', NULL),
('João Mendes', 'joao.mendes@example.com', 'joaom', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Estudante de medicina', NULL),
('Laura Lima', 'laura.lima@example.com', 'lauralima', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Médica veterinária', NULL),
('Lucas Rocha', 'lucas.rocha@example.com', 'lucasr', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Amante de esportes', NULL),
('Mariana Silva', 'mariana.silva@example.com', 'marisilva', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Chef de cozinha', NULL),
('Nicolas Carvalho', 'nicolas.carvalho@example.com', 'nickc', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Cineasta independente', NULL),
('Olívia Ferreira', 'olivia.ferreira@example.com', 'olifer', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Arquiteta', NULL),
('Pedro Costa', 'pedro.costa@example.com', 'pedro123', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Estudante de biologia', NULL),
('Quésia Souza', 'quesia.souza@example.com', 'quesinha', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Professora de inglês', NULL),
('Renato Rocha', 'renato.rocha@example.com', 'renatinho', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Jornalista esportivo', NULL),
('Sara Lima', 'sara.lima@example.com', 'saralima', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Psicóloga', NULL),
('Thiago Martins', 'thiago.martins@example.com', 'thiagom', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Analista financeiro', NULL),
('Ursula Carvalho', 'ursula.carvalho@example.com', 'ursinha', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Designer gráfica', NULL),
('Vitor Almeida', 'vitor.almeida@example.com', 'vitoral', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Cientista de dados', NULL),
('Wesley Santos', 'wesley.santos@example.com', 'w.santos', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Treinador pessoal', NULL),
('Ximena Ramos', 'ximena.ramos@example.com', 'ximeninha', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Estudante de artes', NULL),
('Yasmin Teixeira', 'yasmin.teixeira@example.com', 'yasteixeira', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Fotógrafa', NULL),
('Zoe Pereira', 'zoe.pereira@example.com', 'zoezoe', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Programadora', NULL),
('André Rodrigues', 'andre.rodrigues@example.com', 'andre_rod', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Engenheiro civil', NULL),
('Bárbara Fernandes', 'barbara.fernandes@example.com', 'babi', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Estudante de direito', NULL),
('Caio Ribeiro', 'caio.ribeiro@example.com', 'caio', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Músico', NULL),
('Debora Castro', 'debora.castro@example.com', 'deb', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Atriz', NULL),
('Eduardo Faria', 'eduardo.faria@example.com', 'edufaria', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Professor', NULL);

-- Relacionamentos de amizade entre os usuários
INSERT INTO Friends (fkUser1, fkUser2) VALUES
(1, 2), (1, 3), (1, 4), (1, 5),
(2, 7), (2, 8), (2, 9), (2, 10), (2, 11),
(3, 12), (3, 13), (3, 14), (3, 15), (3, 16),
(4, 17), (4, 18), (4, 19), (4, 20), (4, 21),
(5, 22), (5, 23), (5, 24), (5, 25), (5, 26),
(6, 27), (6, 28), (6, 29), (6, 30),
(7, 8), (7, 20), (7, 19),
(8, 11), (8, 13), (8, 15), (8, 16), (8, 29),
(9, 12), (9, 18), (9, 24), (9, 25),
(10, 15), (10, 19), (10, 21), (10, 22), (10, 27),
(11, 4), (11, 26), (11, 28);




 SELECT idUser, name, username, profilePhotoPath AS photo FROM User 
            WHERE idUser <> 1 AND 
            idUser NOT IN(1, 2, 3, 4) AND 
            idUser NOT IN(1, 2, 3, 4)
            ORDER BY RAND()
            LIMIT 15;
