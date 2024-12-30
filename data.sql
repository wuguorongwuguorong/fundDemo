
use fundOverview;

INSERT INTO Customers (
    cFirst_name, cLast_name, dob, NRIC, gender, addr_1, addr_2, zipcode, cEmail
)
VALUES
-- Row 1 to 30
('John', 'Doe', '1990-01-01', 'S1234567A', 'M', '123 Street A', 'Suite 1', '12345', 'johndoe@example.com'),
('Jane', 'Smith', '1985-05-15', 'T9876543B', 'F', '456 Street B', 'Suite 2', '54321', 'janesmith@example.com'),
('Alice', 'Brown', '1992-03-10', 'S8765432C', 'F', '789 Street C', 'Suite 3', '67890', 'alicebrown@example.com'),
('Bob', 'White', '1988-08-20', 'T7654321D', 'M', '101 Street D', 'Suite 4', '98765', 'bobwhite@example.com'),
('Charlie', 'Green', '1995-12-25', 'S6543210E', 'M', '202 Street E', 'Suite 5', '13579', 'charliegreen@example.com'),
('Emily', 'Black', '1993-04-08', 'T5432109F', 'F', '303 Street F', 'Suite 6', '97531', 'emilyblack@example.com'),
('David', 'Gray', '1987-11-13', 'S4321098G', 'M', '404 Street G', 'Suite 7', '24680', 'davidgray@example.com'),
('Sophia', 'Lee', '1991-06-30', 'T3210987H', 'F', '505 Street H', 'Suite 8', '86420', 'sophialee@example.com'),
('Oliver', 'Clark', '1983-09-12', 'S2109876I', 'M', '606 Street I', 'Suite 9', '75319', 'oliverclark@example.com'),
('Liam', 'Hill', '1994-07-22', 'T1098765J', 'M', '707 Street J', 'Suite 10', '95137', 'liamhill@example.com'),
('Mia', 'Adams', '1986-02-14', 'S9876543K', 'F', '808 Street K', 'Suite 11', '13597', 'miaadams@example.com'),
('Noah', 'Evans', '1999-10-01', 'T8765432L', 'M', '909 Street L', 'Suite 12', '75318', 'noahevans@example.com'),
('Emma', 'Baker', '1984-03-18', 'S7654321M', 'F', '1010 Street M', 'Suite 13', '86410', 'emmabaker@example.com'),
('James', 'Martin', '1996-08-28', 'T6543210N', 'M', '1111 Street N', 'Suite 14', '42086', 'jamesmartin@example.com'),
('Ava', 'Carter', '1997-12-05', 'S5432109O', 'F', '1212 Street O', 'Suite 15', '68024', 'avacarter@example.com'),
('Ethan', 'Moore', '1993-01-17', 'T4321098P', 'M', '1313 Street P', 'Suite 16', '80246', 'ethanmoore@example.com'),
('Isabella', 'Young', '1989-05-19', 'S3210987Q', 'F', '1414 Street Q', 'Suite 17', '62480', 'isabellayoung@example.com'),
('Logan', 'King', '1998-04-25', 'T2109876R', 'M', '1515 Street R', 'Suite 18', '31042', 'loganking@example.com'),
('Ella', 'Wright', '1990-06-08', 'S1098765S', 'F', '1616 Street S', 'Suite 19', '53719', 'ellawright@example.com'),
( 'Henry', 'Scott', '1992-07-11', 'T0987654T', 'M', '1717 Street T', 'Suite 20', '19273', 'henryscott@example.com'),
('Sofia', 'Harris', '1985-11-07', 'S9876543U', 'F', '1818 Street U', 'Suite 21', '48209', 'sofiaharris@example.com'),
( 'Mason', 'Cooper', '1991-02-24', 'T8765432V', 'M', '1919 Street V', 'Suite 22', '80268', 'masoncooper@example.com'),
('Aria', 'Ward', '1994-09-06', 'S7654321W', 'F', '2020 Street W', 'Suite 23', '59731', 'ariaward@example.com'),
('Lucas', 'Perez', '1987-10-03', 'T6543210X', 'M', '2121 Street X', 'Suite 24', '18349', 'lucasperez@example.com'),
('Grace', 'Diaz', '1995-03-15', 'S5432109Y', 'F', '2222 Street Y', 'Suite 25', '75381', 'gracediaz@example.com'),
('Benjamin', 'Gomez', '1986-12-20', 'T4321098Z', 'M', '2323 Street Z', 'Suite 26', '14689', 'benjamingomez@example.com'),
('Harper', 'Reed', '1990-01-05', 'S3210987A', 'F', '2424 Street A', 'Suite 27', '29573', 'harperreed@example.com'),
('Daniel', 'Stewart', '1988-05-30', 'T2109876B', 'M', '2525 Street B', 'Suite 28', '76438', 'danielstewart@example.com'),
('Lily', 'Rogers', '1993-08-19', 'S1098765C', 'F', '2626 Street C', 'Suite 29', '20479', 'lilyrogers@example.com'),
('Alexander', 'Morgan', '1984-11-27', 'T0987654D', 'M', '2727 Street D', 'Suite 30', '38592', 'alexandermorgan@example.com');


INSERT INTO Agents (aFirst_name, aLast_name, aEmail, join_date)
VALUES
('Alice', 'Johnson', 'alice.johnson@example.com', '2018-06-01'),
('Bob', 'Smith', 'bob.smith@example.com', '2017-03-15'),
('Catherine', 'Brown', 'catherine.brown@example.com', '2019-08-20'),
('David', 'Lee', 'david.lee@example.com', '2020-01-10'),
('Emma', 'Davis', 'emma.davis@example.com', '2016-12-05'),
('Frank', 'Taylor', 'frank.taylor@example.com', '2021-07-22'),
('Grace', 'Harris', 'grace.harris@example.com', '2022-04-18'),
('Henry', 'Wilson', 'henry.wilson@example.com', '2023-02-25');


INSERT INTO Banks (bank_name, bank_num, addr_1, addr_2, zipcode, swift_code)
VALUES
('National Bank', 12345678, '123 Elm Street', 'Suite 101', '10001', 'NATBANK123'),
('Citywide Bank', 23456789, '456 Oak Avenue', 'Floor 2', '20002', 'CITYBANK456'),
('Global Trust', 34567890, '789 Pine Blvd', 'Building 3', '30003', 'GLOBTRUST789'),
('Metro Savings', 45678901, '321 Maple Drive', 'Apt 12B', '40004', 'METROSAV456'),
('Pioneer Credit', 56789012, '654 Cedar Lane', 'Office 5', '50005', 'PIONCRED789');


INSERT INTO Pnotes (cust_id, bank_id, divi_id, pstart_date, invest_amt)
VALUES
(1, 1, 1, '2022-01-31', 250000.00),
(2, 2, 1, '2022-02-28', 500000.00),
(3, 3, 1, '2022-03-31', 750000.00),
(4, 4, 1, '2022-04-30', 250000.00),
(5, 5, 1, '2022-05-31', 500000.00),
(6, 1, 1, '2022-06-30', 750000.00),
(7, 2, 1, '2022-07-31', 250000.00),
(8, 3, 1, '2022-08-31', 500000.00),
(9, 4, 1, '2022-09-30', 750000.00),
(10, 5, 1, '2022-10-31', 250000.00),
(11, 1, 1, '2022-11-30', 500000.00),
(12, 2, 1, '2022-12-31', 750000.00),
(13, 3, 1, '2023-01-31', 250000.00),
(14, 4, 1, '2023-02-28', 500000.00),
(15, 5, 1, '2023-03-31', 750000.00),
(16, 1, 1, '2023-04-30', 250000.00),
(17, 2, 1, '2023-05-31', 500000.00),
(18, 3, 1, '2023-06-30', 750000.00),
(19, 4, 1, '2023-07-31', 250000.00),
(20, 5, 1, '2023-08-31', 500000.00),
(21, 1, 1, '2023-09-30', 750000.00),
(22, 2, 1, '2023-10-31', 250000.00),
(23, 3, 1, '2023-11-30', 500000.00),
(24, 4, 1, '2023-12-31', 750000.00),
(25, 5, 1, '2024-01-31', 250000.00),
(26, 1, 1, '2024-02-28', 500000.00),
(27, 2, 1, '2024-03-31', 750000.00),
(28, 3, 1, '2024-04-30', 250000.00),
(29, 4, 1, '2024-05-31', 500000.00),
(30, 5, 1, '2024-06-30', 750000.00);



INSERT INTO Dividends (payout_date, nav_payout)
VALUES
('2022-02-28', 1.25),
('2022-03-31', 1.25),
('2022-04-30', 1.25),
('2022-05-31', 1.25),
('2022-06-30', 1.25),
('2022-07-31', 1.25),
('2022-08-31', 1.25),
('2022-09-30', 1.25),
('2022-10-31', 1.25),
('2022-11-30', 1.25),
('2022-12-31', 1.25),
('2023-01-31', 1.25),
('2023-02-28', 1.25),
('2023-03-31', 1.25),
('2023-04-30', 1.25),
('2023-05-31', 1.25),
('2023-06-30', 1.25),
('2023-07-31', 1.25),
('2023-08-31', 1.25),
('2023-09-30', 1.25),
('2023-10-31', 1.25),
('2023-11-30', 1.25),
('2023-12-31', 1.25);


INSERT INTO MonthlyComms (pnote_id, agent_id, comms_base)
VALUES
(31, 1, 1),
(32, 2, 1),
(33, 3, 1),
(34, 4, 1),
(35, 5, 1),
(36, 6, 1),
(37, 7, 1),
(38, 8, 1),
(39, 1, 1),
(40, 2, 1),
(41, 3, 1),
(42, 4, 1),
(43, 5, 1),
(44, 6, 1),
(45, 7, 1),
(46, 8, 1),
(47, 1, 1),
(48, 2, 1),
(49, 3, 1),
(50, 4, 1),
(51, 5, 1),
(52, 6, 1),
(53, 7, 1),
(54, 8, 1),
(55, 1, 1),
(56, 2, 1),
(57, 3, 1),
(58, 4, 1),
(59, 5, 1),
(60, 6, 1);