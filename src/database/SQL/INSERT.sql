USE fishbook;

INSERT INTO User (name, email, username, password, bio, profilePhotoPath) VALUES
('João Silva', 'joao.silva@example.com', 'joaosilva', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Aficionado por pesca esportiva.', NULL),
('Maria Souza', 'maria.souza@example.com', 'mariasouza', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Amante da pesca e da natureza.', NULL),
('Ana Oliveira', 'ana.oliveira@example.com', 'anaoliveira', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Pesca é minha paixão.', NULL),
('Carlos Santos', 'carlos.santos@example.com', 'carlossantos', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Pescador profissional.', NULL),
('Fernanda Lima', 'fernanda.lima@example.com', 'fernandalima', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Apaixonada por pesca esportiva.', NULL),
('Pedro Costa', 'pedro.costa@example.com', 'pedrocosta', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Pescar é meu hobby.', NULL),
('Juliana Almeida', 'juliana.almeida@example.com', 'julianaalmeida', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Adoro pescar nos fins de semana.', NULL),
('Rafael Pereira', 'rafael.pereira@example.com', 'rafaelpereira', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Pesca esportiva é minha vida.', NULL),
('Beatriz Fernandes', 'beatriz.fernandes@example.com', 'beatrizfernandes', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Pescadora nas horas vagas.', NULL),
('Lucas Rodrigues', 'lucas.rodrigues@example.com', 'lucasrodrigues', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Pescar é minha terapia.', NULL),
('Larissa Carvalho', 'larissa.carvalho@example.com', 'larissacarvalho', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Apaixonada por pesca e aventura.', NULL),
('Gabriel Gomes', 'gabriel.gomes@example.com', 'gabrielgomes', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Pesca é meu esporte favorito.', NULL),
('Camila Ribeiro', 'camila.ribeiro@example.com', 'camilaribeiro', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Adoro pescar com amigos.', NULL),
('Felipe Martins', 'felipe.martins@example.com', 'felipemartins', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Pescar é minha paixão.', NULL),
('Isabela Araujo', 'isabela.araujo@example.com', 'isabelaaraujo', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Pescadora de coração.', NULL),
('Rodrigo Barros', 'rodrigo.barros@example.com', 'rodrigobarros', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Pescar é meu estilo de vida.', NULL),
('Patrícia Mendes', 'patricia.mendes@example.com', 'patriciamendes', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Amante da pesca esportiva.', NULL),
('Thiago Correia', 'thiago.correia@example.com', 'thiagocorreia', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Pescar é minha paixão.', NULL),
('Renata Nunes', 'renata.nunes@example.com', 'renatanunes', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Adoro pescar e relaxar.', NULL),
('Bruno Teixeira', 'bruno.teixeira@example.com', 'brunoteixeira', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Pescar é minha paixão.', NULL),
('Bryan Rocha', 'bryangomesrocha@gmail.com', 'bryan_ro', '$2b$10$IfBsvj.5NRBUrHcycrHsd.QPh9TI5A7xWlMBYRsNL3zwTI0bT5k4q', 'Apaixonado por pesca esportiva.', NULL);

INSERT INTO Friends (fkUser1, fkUser2) VALUES
(1, 2),
(1, 3),
(2, 4),
(2, 5),
(3, 6),
(4, 7),
(5, 8),
(6, 9),
(7, 10),
(8, 11),
(9, 12),
(10, 13),
(11, 14),
(12, 15),
(13, 16),
(14, 17),
(15, 18),
(16, 19),
(17, 20),
(18, 1),
(19, 2),
(20, 3);


INSERT INTO Friends (fkUser1, fkUser2) VALUES
(21, 4),
(21, 5),
(21, 6),
(21, 7),
(21, 8),
(21, 9),
(21, 10),
(21, 11),
(21, 12),
(21, 13);




INSERT INTO UsageTime (date, usageTimeInMinutes, lastUpdate, fkUser)
VALUES
('2024-11-01', 60, '2024-11-01 12:00:00', 21),
('2024-11-02', 90, '2024-11-02 12:00:00', 21),
('2024-11-03', 45, '2024-11-03 12:00:00', 21),
('2024-11-04', 30, '2024-11-04 12:00:00', 21),
('2024-11-05', 120, '2024-11-05 12:00:00', 21),
('2024-11-06', 75, '2024-11-06 12:00:00', 21),
('2024-11-07', 60, '2024-11-07 12:00:00', 21),
('2024-11-08', 90, '2024-11-08 12:00:00', 21),
('2024-11-09', 45, '2024-11-09 12:00:00', 21),
('2024-11-10', 30, '2024-11-10 12:00:00', 21),
('2024-11-11', 120, '2024-11-11 12:00:00', 21),
('2024-11-12', 75, '2024-11-12 12:00:00', 21),
('2024-11-13', 60, '2024-11-13 12:00:00', 21),
('2024-11-14', 90, '2024-11-14 12:00:00', 21),
('2024-11-15', 45, '2024-11-15 12:00:00', 21),
('2024-11-16', 30, '2024-11-16 12:00:00', 21),
('2024-11-17', 120, '2024-11-17 12:00:00', 21),
('2024-11-18', 75, '2024-11-18 12:00:00', 21),
('2024-11-19', 60, '2024-11-19 12:00:00', 21),
('2024-11-20', 90, '2024-11-20 12:00:00', 21),
('2024-11-21', 45, '2024-11-21 12:00:00', 21),
('2024-11-22', 30, '2024-11-22 12:00:00', 21),
('2024-11-23', 120, '2024-11-23 12:00:00', 21),
('2024-11-24', 75, '2024-11-24 12:00:00', 21),
('2024-11-25', 60, '2024-11-25 12:00:00', 21);


INSERT INTO ProfileVisit (fkUser, fkVisitor) VALUES
(21, 1),
(21, 2),
(21, 3),
(21, 4),
(21, 5),
(21, 6),
(21, 7),
(21, 8),
(21, 9),
(21, 10),
(21, 11),
(21, 12),
(21, 13),
(21, 14),
(21, 15),
(21, 16),
(21, 17),
(21, 18),
(21, 19),
(21, 20);



INSERT INTO ProfileVisit (fkUser, fkVisitor, dateTime) VALUES
(21, 1, '2023-11-01 12:00:00'),
(21, 2, '2023-12-01 12:00:00'),
(21, 3, '2024-01-01 12:00:00'),
(21, 4, '2024-02-01 12:00:00'),
(21, 5, '2024-03-01 12:00:00'),
(21, 6, '2024-04-01 12:00:00'),
(21, 7, '2024-05-01 12:00:00'),
(21, 8, '2024-06-01 12:00:00'),
(21, 9, '2024-07-01 12:00:00'),
(21, 10, '2024-08-01 12:00:00'),
(21, 11, '2024-09-01 12:00:00'),
(21, 12, '2024-10-01 12:00:00'),
(21, 13, '2024-11-01 12:00:00'),
(21, 14, '2024-12-01 12:00:00'),
(21, 15, '2023-11-15 12:00:00'),
(21, 16, '2023-12-15 12:00:00'),
(21, 17, '2024-01-15 12:00:00'),
(21, 18, '2024-02-15 12:00:00'),
(21, 19, '2024-03-15 12:00:00'),
(21, 20, '2024-04-15 12:00:00');

