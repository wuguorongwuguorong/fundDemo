-- sample INSERT statments for abc fund schema

use fundOVerview;

INSERT INTO Customers (bank_id, agent_id, pnote_id, cFirst_name, cLast_name, dob, NRIC, gender, addr_1, addr_2, zipcode, cEmail, bank_num)
VALUES
    (1, 1, 1, 'Alice', 'Smith', '1990-01-15', 'S1234567A', 'F', '123 Elm St', 'Apt 101', '90210', 'alice.smith@example.com', 123456),
    (2, 2, 2, 'Bob', 'Johnson', '1985-06-25', 'T2345678B', 'M', '456 Maple Ave', 'Unit 204', '10001', 'bob.johnson@example.com', 234567),
    (3, 3, 3, 'Charlie', 'Brown', '1992-03-12', 'U3456789C', 'M', '789 Oak Rd', 'Suite 3A', '30303', 'charlie.brown@example.com', 345678),
    (4, 1, 4, 'Daisy', 'Taylor', '1980-08-19', 'V4567890D', 'F', '321 Pine Ln', 'Floor 2', '60606', 'daisy.taylor@example.com', 456789),
    (5, 2, 5, 'Ethan', 'Anderson', '1995-11-23', 'W5678901E', 'M', '654 Cedar Blvd', 'Office 5C', '77001', 'ethan.anderson@example.com', 567890),
    (1, 3, 6, 'Fiona', 'Clark', '1990-02-14', 'X6789012F', 'F', '123 Birch St', 'Apt 302', '10101', 'fiona.clark@example.com', 678901),
    (2, 1, 7, 'George', 'Miller', '1988-05-05', 'Y7890123G', 'M', '456 Aspen Way', 'Unit 7B', '60607', 'george.miller@example.com', 789012),
    (3, 2, 8, 'Hannah', 'Davis', '1993-07-09', 'Z8901234H', 'F', '789 Spruce Ln', 'Suite 101', '77002', 'hannah.davis@example.com', 890123),
    (4, 3, 9, 'Ian', 'Wilson', '1991-10-20', 'A9012345I', 'M', '321 Poplar Rd', 'Floor 4', '90211', 'ian.wilson@example.com', 901234),
    (5, 1, 10, 'Jade', 'Moore', '1987-12-15', 'B0123456J', 'F', '654 Walnut St', 'Office 12', '10002', 'jade.moore@example.com', 123012),
    (1, 2, 11, 'Kevin', 'Taylor', '1994-01-17', 'C1234567K', 'M', '123 Sycamore Rd', 'Apt 8C', '60608', 'kevin.taylor@example.com', 234123),
    (2, 3, 12, 'Laura', 'Harris', '1989-03-22', 'D2345678L', 'F', '456 Alder Way', 'Unit 305', '30304', 'laura.harris@example.com', 345234),
    (3, 1, 13, 'Mike', 'Adams', '1992-06-18', 'E3456789M', 'M', '789 Willow Ln', 'Suite 3C', '77003', 'mike.adams@example.com', 456345),
    (4, 2, 14, 'Nina', 'Scott', '1986-09-30', 'F4567890N', 'F', '321 Fir St', 'Floor 5', '90212', 'nina.scott@example.com', 567456),
    (5, 3, 15, 'Oliver', 'Evans', '1990-12-11', 'G5678901O', 'M', '654 Redwood Rd', 'Office 11', '10003', 'oliver.evans@example.com', 678567),
    (1, 1, 16, 'Paula', 'King', '1985-04-27', 'H6789012P', 'F', '123 Beech Ln', 'Apt 4B', '60609', 'paula.king@example.com', 789678),
    (2, 2, 17, 'Quincy', 'Wright', '1993-08-14', 'I7890123Q', 'M', '456 Chestnut Blvd', 'Unit 6C', '30305', 'quincy.wright@example.com', 890789),
    (3, 3, 18, 'Rachel', 'Walker', '1994-11-07', 'J8901234R', 'F', '789 Elmwood Dr', 'Suite 5A', '77004', 'rachel.walker@example.com', 901890),
    (4, 1, 19, 'Sam', 'Hall', '1987-02-19', 'K9012345S', 'M', '321 Dogwood St', 'Floor 1', '90213', 'sam.hall@example.com', 123901),
    (5, 2, 20, 'Tina', 'Young', '1991-05-12', 'L0123456T', 'F', '654 Juniper Ln', 'Office 9', '10004', 'tina.young@example.com', 234012),
    (1, 3, 21, 'Uma', 'Allen', '1995-09-05', 'M1234567U', 'F', '123 Magnolia Rd', 'Apt 7A', '60610', 'uma.allen@example.com', 345123),
    (2, 1, 22, 'Victor', 'Perez', '1989-12-29', 'N2345678V', 'M', '456 Maplewood Ave', 'Unit 202', '30306', 'victor.perez@example.com', 456234),
    (3, 2, 23, 'Wendy', 'Clarkson', '1993-03-08', 'O3456789W', 'F', '789 River Rd', 'Suite 6C', '77005', 'wendy.clarkson@example.com', 567345),
    (4, 3, 24, 'Xavier', 'Bell', '1990-06-17', 'P4567890X', 'M', '321 Highland Blvd', 'Floor 3', '90214', 'xavier.bell@example.com', 678456);

INSERT INTO Agents (aFirst_name, aLast_name, aEmail, join_date)
VALUES
    ('John', 'Doe', 'john.doe@example.com', '2021-05-15 09:00:00'),
    ('Jane', 'Smith', 'jane.smith@example.com', '2020-08-01 10:30:00'),
    ('Emily', 'Taylor', 'emily.taylor@example.com', '2019-11-20 14:45:00');

INSERT INTO Banks (bank_name, addr_1, addr_2, zipcode, swift_code)
VALUES
    ('National Trust Bank', '123 Elm Street', 'Suite 400', '90210', 'NATRUS33XXX'),
    ('Global Finance Bank', '456 Maple Avenue', 'Floor 2', '10001', 'GLOBUS22XXX'),
    ('Pioneer Savings', '789 Oak Road', 'Building A', '30303', 'PIOSUS44XXX'),
    ('Unity Federal Bank', '321 Pine Lane', 'Apt 5B', '60606', 'UNIFUS55XXX'),
    ('Capital Growth Bank', '654 Cedar Blvd', 'Office 10', '77001', 'CAPGUS66XXX');

INSERT INTO Pnotes (cust_id, insert_date, invest_amt, maintenance_fee)
VALUES
    (1, '2022-01-05', 200000, 0.02),
    (2, '2022-02-10', 450000, 0.02),
    (3, '2022-03-15', 750000, 0.02),
    (4, '2022-04-20', 200000, 0.02),
    (5, '2022-05-25', 450000, 0.02),
    (6, '2022-06-30', 750000, 0.02),
    (7, '2022-07-10', 200000, 0.02),
    (8, '2022-08-15', 450000, 0.02),
    (9, '2022-09-05', 750000, 0.02),
    (10, '2022-10-20', 200000, 0.02),
    (11, '2022-11-30', 450000, 0.02),
    (12, '2022-12-10', 750000, 0.02),
    (13, '2022-01-25', 200000, 0.02),
    (14, '2022-02-05', 450000, 0.02),
    (15, '2022-03-10', 750000, 0.02),
    (16, '2022-04-15', 200000, 0.02),
    (17, '2022-05-05', 450000, 0.02),
    (18, '2022-06-25', 750000, 0.02),
    (19, '2022-07-15', 200000, 0.02),
    (20, '2022-08-30', 450000, 0.02),
    (21, '2022-09-10', 750000, 0.02),
    (22, '2022-10-05', 200000, 0.02),
    (23, '2022-11-25', 450000, 0.02),
    (24, '2022-12-20', 750000, 0.02);


INSERT INTO Dividends (payout_date, nav_payout)
VALUES
    ('2021-03-01 00:00:00', ROUND(3 + RAND() * (5 - 3), 3)),
    ('2021-06-01 00:00:00', ROUND(3 + RAND() * (5 - 3), 3)),
    ('2021-09-01 00:00:00', ROUND(3 + RAND() * (5 - 3), 3)),
    ('2021-12-01 00:00:00', ROUND(3 + RAND() * (5 - 3), 3)),
    ('2022-03-01 00:00:00', ROUND(3 + RAND() * (5 - 3), 3)),
    ('2022-06-01 00:00:00', ROUND(3 + RAND() * (5 - 3), 3)),
    ('2022-09-01 00:00:00', ROUND(3 + RAND() * (5 - 3), 3)),
    ('2022-12-01 00:00:00', ROUND(3 + RAND() * (5 - 3), 3)),
    ('2023-03-01 00:00:00', ROUND(3 + RAND() * (5 - 3), 3)),
    ('2023-06-01 00:00:00', ROUND(3 + RAND() * (5 - 3), 3)),
    ('2023-09-01 00:00:00', ROUND(3 + RAND() * (5 - 3), 3)),
    ('2023-12-01 00:00:00', ROUND(3 + RAND() * (5 - 3), 3));


INSERT INTO Commissions (comms_desc, comms_payout)
VALUES 
    ('More than 0 and less than 99,999', 0.005),
    ('More than 100,000 and less than 199,999', 0.01),
    ('More than 200,000 and less than 399,999', 0.02),
    ('More than 400,000 and less than 599,999', 0.03),
    ('More than 600,000 and less than 799,999', 0.04),
    ('More than 800,000', 0.05);