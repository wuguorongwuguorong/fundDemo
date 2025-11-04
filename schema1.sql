CREATE DATABASE IF NOT EXISTS mgmtFundoverview;

USE mgmtFundoverview;

CREATE TABLE IF NOT EXISTS Banks(
    bank_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    bank_name VARCHAR(255) NOT NULL, 
    addr_1 VARCHAR(45) NOT NULL,
    addr_2 VARCHAR(45) NOT NULL,
    zipcode VARCHAR(10) NOT NULL,
    swift_code VARCHAR(16) NOT NULL
);

CREATE TABLE IF NOT EXISTS Customers (
    cust_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    cFirst_name VARCHAR(255) NOT NULL,
    cLast_name VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    NRIC VARCHAR(16) NOT NULL,
    gender CHAR NOT NULL,
    addr_1 VARCHAR(45) NOT NULL,
    addr_2 VARCHAR(45) NOT NULL,
    zipcode VARCHAR(10) NOT NULL,
    cEmail VARCHAR(100) NOT NULL,
    bank_num INT NOT NULL,
    bank_id INT UNSIGNED NOT NULL,
    FOREIGN KEY(bank_id) REFERENCES Banks(bank_id)
);

CREATE TABLE IF NOT EXISTS Agents(
    agent_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    aFirst_name VARCHAR(255) NOT NULL,
    aLast_name VARCHAR(255) NOT NULL,
    aEmail VARCHAR(100) NOT NULL,
    join_date DATETIME NOT NULL
);



CREATE TABLE IF NOT EXISTS Pnotes(
    pnote_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    pstart_date DATE NOT NULL,
    pend_date DATE,
    invest_amt DECIMAL(10,2) NOT NULL,
    maintenance_fee DECIMAL(10,2) NOT NULL,
    cust_id INT UNSIGNED NOT NULL,
    agent_id INT UNSIGNED NOT NULL,
    FOREIGN KEY(cust_id) REFERENCES Customers(cust_id),
    FOREIGN KEY(agent_id)REFERENCES Agents(agent_id)
);


CREATE TABLE IF NOT EXISTS MonthlyComms(
    moncomms_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    rate_percent DECIMAL(5,2) NOT NULL,
    pnote_id INT UNSIGNED NOT NULL,
    agent_id INT UNSIGNED NOT NULL,
    FOREIGN KEY(pnote_id) REFERENCES Pnotes(pnote_id),
    FOREIGN KEY (agent_id) REFERENCES Agents(agent_id)
);


