SET SQL_SAFE_UPDATES = 0;

-- To  create the SQL tables, run the whole code (click the lightning icon at the top left)
-- To reset, the DB uncomment the drop table and run the code
 

-- DROP TABLE user_profile_pic;
-- DROP TABLE admin_profile_pic;
-- DROP TABLE user_password_reset;
-- DROP TABLE admin_password_reset;

-- DROP TABLE parking;
-- DROP TABLE vehicle;

-- DROP TABLE user_information;

-- DROP TABLE admin_information;
-- DROP TABLE admin_codes;

-- DROP TABLE lot;


-- Will create the table for the lot
CREATE TABLE lot (
    lot_id int,
    zone VARCHAR(50),
    parking_type ENUM("Regular", "Faculty", "Reserved"),
    parking_status ENUM("occupied", "vacant") DEFAULT "vacant",
    PRIMARY KEY (lot_id, zone)
);


-- Inserting sample data into the lot table (Regular)
INSERT INTO lot(lot_id, zone, parking_type)
VALUES
(1, 'ICTC', 'Regular'),
(2, 'ICTC', 'Regular'),
(3, 'ICTC', 'Regular'),
(4, 'ICTC', 'Regular'),
(5, 'ICTC', 'Reserved'),
(6, 'ICTC', 'Regular'),
(7, 'ICTC', 'Regular'),
(8, 'ICTC', 'Regular'),
(9, 'ICTC', 'Regular'),
(10, 'ICTC', 'Regular'),
(11, 'ICTC', 'Regular'),
(12, 'ICTC', 'Regular'),
(13, 'ICTC', 'Regular'),
(14, 'ICTC', 'Regular'),
(1, 'Magdalo', 'Regular'),
(2, 'Magdalo', 'Regular'),
(3, 'Magdalo', 'Regular'),
(4, 'Magdalo', 'Regular'),
(5, 'Magdalo', 'Reserved'),
(6, 'Magdalo', 'Regular'),
(7, 'Magdalo', 'Regular'),
(8, 'Magdalo', 'Regular'),
(9, 'Magdalo', 'Regular'),
(10, 'Magdalo', 'Regular'),
(11, 'Magdalo', 'Regular'),
(12, 'Magdalo', 'Regular'),
(13, 'Magdalo', 'Regular'),
(14, 'Magdalo', 'Regular'),
(1, 'ADG', 'Regular'),
(2, 'ADG', 'Regular'),
(3, 'ADG', 'Regular'),
(4, 'ADG', 'Regular'),
(5, 'ADG', 'Reserved'),
(6, 'ADG', 'Regular'),
(7, 'ADG', 'Regular'),
(8, 'ADG', 'Regular'),
(9, 'ADG', 'Regular'),
(10, 'ADG', 'Regular'),
(11, 'ADG', 'Regular'),
(12, 'ADG', 'Regular'),
(13, 'ADG', 'Regular'),
(14, 'ADG', 'Regular');


--  | = | = | = | = | = | = |


-- Pre-made admin code for admin account creation
CREATE TABLE admin_codes (
    admin_code VARCHAR(10) PRIMARY KEY,
    is_used BOOLEAN DEFAULT FALSE
);

INSERT INTO admin_codes (admin_code)
VALUES
    ('ABCDE12345'),
    ('FGHIJ67890'),
    ('KLMNO54321'),
    ('PQRST09876'),
    ('UVWXY13579'),
    ('ZABCD24680'),
    ('EFGHI86420'),
    ('JKLMN97531'),
    ('OPQRS86420'),
    ('TUVWX75319');

--  | = | = | = | = | = | = |


-- Will create the admin database
CREATE TABLE admin_information (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    admin_code VARCHAR(10) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    account_password VARCHAR(255),
    email VARCHAR(100) NOT NULL UNIQUE,
    refresh_token VARCHAR(512)
);


-- Will create admin account into the admin table and update the admin_code table
INSERT INTO admin_information (admin_code, first_name, last_name, account_password, email) 
VALUES('ABCDE12345', 'John', 'Doe', 'password123', "johndoe@gmail.com");
UPDATE admin_codes  SET is_used = true WHERE admin_code = 'ABCDE12345';

INSERT INTO admin_information (admin_code, first_name, last_name, account_password, email) 
VALUES('FGHIJ67890', 'Jim', 'Boom', 'password321', "jimboom@gmail.com");
UPDATE admin_codes  SET is_used = true WHERE admin_code = 'FGHIJ67890';


--  Will create the user data
CREATE TABLE user_information(
    user_id VARCHAR(20) PRIMARY KEY,
    account_type ENUM ("Worker", "Student"),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    account_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    refresh_token VARCHAR(512)
);


INSERT INTO user_information(user_id, account_type, first_name, last_name, email, account_password)
VALUES
    
    (123456789, "Student", 'Emily', 'Clark', 'emily.clark@dlsud.edu', 'emilypassword'), 
    (987654321, "Student", 'Michael', 'Johnson', 'michael.johnson@dlsud.edu', 'michaelpassword'),
    (234567890, "Student", 'Sarah', 'Williams', 'sarah.williams@dlsud.edu', 'sarahpassword'),
    (345678901, "Student", 'David', 'Jones', 'david.jones@dlsud.edu', 'davidpassword'),
    (456789012, "Student", 'Laura', 'Garcia', 'laura.garcia@dlsud.edu', 'laurapassword'),
    (567890123, "Worker", 'Chris', 'Wilson', 'chris.wilson@dlsud.edu', 'chrispassword'),
    (678901234, "Worker", 'Jessica', 'Brown', 'jessica.brown@dlsud.edu', 'jessicapassword'),
    (789012345, "Worker", 'Brian', 'Miller', 'brian.miller@dlsud.edu', 'brianpassword'),
    (890123456, "Worker", 'Megan', 'Davis', 'megan.davis@dlsud.edu', 'meganpassword'),
    (901234567, "Worker", 'Kevin', 'Moore', 'kevin.moore@dlsud.edu', 'kevinpassword'),
    
    -- New Entries 
    (112233445, 'Student', 'Ava', 'Taylor', 'ava.taylor@dlsud.edu', 'avapassword'),
	(223344556, 'Student', 'Ethan', 'Anderson', 'ethan.anderson@dlsud.edu', 'ethanpassword'),
	(334455667, 'Student', 'Olivia', 'Thomas', 'olivia.thomas@dlsud.edu', 'oliviapassword'),
	(445566778, 'Student', 'Liam', 'Martin', 'liam.martin@dlsud.edu', 'liampassword'),
	(556677889, 'Student', 'Sophia', 'White', 'sophia.white@dlsud.edu', 'sophiapassword'),
	(667788990, 'Student', 'James', 'Lee', 'james.lee@dlsud.edu', 'jamespassword'),
	(778899001, 'Student', 'Isabella', 'Harris', 'isabella.harris@dlsud.edu', 'isabellapassword'),
	(889900112, 'Student', 'Logan', 'Clark', 'logan.clark@dlsud.edu', 'loganpassword'),
	(990011223, 'Student', 'Mia', 'Robinson', 'mia.robinson@dlsud.edu', 'miapassword'),
	(101112131, 'Student', 'Lucas', 'Walker', 'lucas.walker@dlsud.edu', 'lucaspassword'),

	(131211109, 'Worker', 'Zoe', 'Young', 'zoe.young@dlsud.edu', 'zoepassword'),
	(141312113, 'Worker', 'Nathan', 'Hall', 'nathan.hall@dlsud.edu', 'nathanpassword'),
	(151413117, 'Worker', 'Chloe', 'Allen', 'chloe.allen@dlsud.edu', 'chloepassword'),
	(161514121, 'Worker', 'Elijah', 'King', 'elijah.king@dlsud.edu', 'elijahpassword'),
	(171615125, 'Worker', 'Ella', 'Wright', 'ella.wright@dlsud.edu', 'ellapassword'),
	(181716129, 'Worker', 'Aiden', 'Scott', 'aiden.scott@dlsud.edu', 'aidenpassword'),
	(191817133, 'Worker', 'Grace', 'Torres', 'grace.torres@dlsud.edu', 'gracepassword'),
	(202918137, 'Worker', 'Carter', 'Nguyen', 'carter.nguyen@dlsud.edu', 'carterpassword'),
	(213019141, 'Worker', 'Lily', 'Green', 'lily.green@dlsud.edu', 'lilypassword'),
	(223120145, 'Worker', 'Jack', 'Adams', 'jack.adams@dlsud.edu', 'jackpassword'),

	(233221149, 'Student', 'Aria', 'Nelson', 'aria.nelson@dlsud.edu', 'ariapassword'),
	(243322153, 'Student', 'Henry', 'Baker', 'henry.baker@dlsud.edu', 'henrypassword'),
	(253423157, 'Student', 'Sofia', 'Gonzalez', 'sofia.gonzalez@dlsud.edu', 'sofiapassword'),
	(263524161, 'Student', 'Daniel', 'Carter', 'daniel.carter@dlsud.edu', 'danielpassword'),
	(273625165, 'Student', 'Camila', 'Mitchell', 'camila.mitchell@dlsud.edu', 'camilapassword'),
	(283726169, 'Student', 'Matthew', 'Perez', 'matthew.perez@dlsud.edu', 'matthewpassword'),
	(293827173, 'Student', 'Scarlett', 'Roberts', 'scarlett.roberts@dlsud.edu', 'scarlettpassword'),
	(303928177, 'Student', 'Jacob', 'Turner', 'jacob.turner@dlsud.edu', 'jacobpassword'),
	(314029181, 'Student', 'Victoria', 'Phillips', 'victoria.phillips@dlsud.edu', 'victoriapassword'),
	(324130185, 'Student', 'Sebastian', 'Campbell', 'sebastian.campbell@dlsud.edu', 'sebastianpassword');

--  | = | = | = | = | = | = |


-- Will create the vehicle table
CREATE TABLE vehicle (
    vehicle_plate VARCHAR(10) PRIMARY KEY,
    user_id VARCHAR(20),
    vehicle_type ENUM("Car", "Motorcycle"),
    FOREIGN KEY (user_id) REFERENCES user_information(user_id) ON DELETE CASCADE
);

-- Will insert the worker vehicles into the vehicle table
INSERT INTO vehicle(vehicle_plate, user_id, vehicle_type)
VALUES
	('ABC123', 123456789, 'Car'),
	('XYZ456', 987654321, 'Motorcycle'),
	('LMN789', 234567890, 'Motorcycle'),
	('DEF012', 345678901, 'Car'),
	('GHI345', 456789012, 'Motorcycle'),

	('JKL678', 567890123, 'Car'),
	('MNO901', 678901234, 'Motorcycle'),
	('PQR234', 789012345, 'Car'),
	('STU567', 890123456, 'Car'),
	("LUV345", "901234567", "Car"),

	-- New Entries 
    ('DLS001', 112233445, 'Motorcycle'),
	('DLS002', 223344556, 'Car'),
	('DLS003', 334455667, 'Car'),
	('DLS004', 445566778, 'Motorcycle'),
	('DLS005', 556677889, 'Car'),
	('DLS006', 667788990, 'Car'),
	('DLS007', 778899001, 'Car'),
	('DLS008', 889900112, 'Motorcycle'),
	('DLS009', 990011223, 'Car'),
	('DLS010', 101112131, 'Car'),

	('DLS011', 131211109, 'Car'),
	('DLS012', 141312113, 'Car'),
	('DLS013', 151413117, 'Car'),
	('DLS014', 161514121, 'Motorcycle'),
	('DLS015', 171615125, 'Car'),
	('DLS016', 181716129, 'Car'),
	('DLS017', 191817133, 'Car'),
	('DLS018', 202918137, 'Motorcycle'),
	('DLS019', 213019141, 'Car'),
	('DLS020', 223120145, 'Car'),

	('DLS021', 233221149, 'Car'),
	('DLS022', 243322153, 'Car'),
	('DLS023', 253423157, 'Car'),
	('DLS024', 263524161, 'Motorcycle'),
	('DLS025', 273625165, 'Car'),
	('DLS026', 283726169, 'Car'),
	('DLS027', 293827173, 'Motorcycle'),
	('DLS028', 303928177, 'Car'),
	('DLS029', 314029181, 'Car'),
	('DLS030', 324130185, 'Motorcycle');



-- | = | = | = | = | = | = |


-- Creating the parking table
CREATE TABLE parking (
    parking_id INT PRIMARY KEY AUTO_INCREMENT,
    lot_id INT,
    zone VARCHAR(50),
    vehicle_plate VARCHAR(10),
    user_id VARCHAR(20),
    occupied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    vacated_at TIMESTAMP,
    duration INT,
    admin_in_id INT,
    admin_out_id INT,
    FOREIGN KEY (lot_id, zone) REFERENCES lot(lot_id, zone) ON DELETE SET NULL,
    FOREIGN KEY (vehicle_plate) REFERENCES vehicle(vehicle_plate) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES user_information(user_id) ON DELETE RESTRICT,
    FOREIGN KEY (admin_in_id) REFERENCES admin_information(admin_id) ON DELETE SET NULL,
    FOREIGN KEY (admin_out_id) REFERENCES admin_information(admin_id) ON DELETE SET NULL
);


-- User (Student) parking onto the lot
INSERT INTO parking (lot_id, zone, vehicle_plate, user_id, admin_in_id)
VALUES(1, "ICTC", "ABC123", 123456789, 1);
UPDATE lot SET parking_status = "occupied" WHERE lot_id = 1 AND  zone = "ICTC" ;

INSERT INTO parking (lot_id, zone, vehicle_plate, user_id, admin_in_id)
VALUES(3, "ICTC", "DEF012", 345678901, 1);
UPDATE lot SET parking_status = "occupied" WHERE lot_id = 3 AND  zone = "ICTC" ;

-- User (Worker) parking onto the lot
INSERT INTO parking (lot_id, zone, vehicle_plate, user_id, admin_in_id)
VALUES(10, "ICTC", "JKL678", 567890123, 1);
UPDATE lot SET parking_status = "occupied" WHERE lot_id = 10 AND  zone = "ICTC";


-- User (Student) leaving the lot
UPDATE lot SET parking_status = "vacant" WHERE lot_id IN (SELECT lot_id FROM parking WHERE user_id = 123456789 and vacated_at IS NULL);
UPDATE parking 
SET vacated_at = CURRENT_TIMESTAMP, duration = TIMESTAMPDIFF(MINUTE, occupied_at, CURRENT_TIMESTAMP), admin_out_id = 1
WHERE user_id = 123456789;

CREATE TABLE user_profile_pic (
	ID VARCHAR(20) UNIQUE NOT NULL,
    prof_pic LONGBLOB,
    FOREIGN KEY (ID) REFERENCES user_information(user_id)
);

CREATE TABLE admin_profile_pic (
	ID INT UNIQUE NOT NULL,
    prof_pic LONGBLOB,
    FOREIGN KEY (ID) REFERENCES admin_information(admin_id)
);

CREATE TABLE user_password_reset (
	email VARCHAR(255) PRIMARY KEY,
    otp_code INT NOT NULL,
    expires_at DATETIME NOT NULL,
    FOREIGN KEY (email) REFERENCES user_information(email)
);

CREATE TABLE admin_password_reset (
	email VARCHAR(255) PRIMARY KEY,
    otp_code INT NOT NULL,
    expires_at DATETIME NOT NULL,
    FOREIGN KEY (email) REFERENCES admin_information(email)
);






 


